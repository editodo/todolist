// server/social.js
// Verifies Sign in with Apple / Google ID tokens against the providers' published keys,
// and (when the Apple key is configured) handles Apple's token exchange and revocation on account deletion.
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const APPLE_ISSUER = 'https://appleid.apple.com';
const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];
const JWKS_URLS = {
    apple: 'https://appleid.apple.com/auth/keys',
    google: 'https://www.googleapis.com/oauth2/v3/certs',
};
const JWKS_TTL_MS = 60 * 60 * 1000;
const jwksCache = {};

// Apple tokens are issued to the iOS bundle ID or, for web sign-in, to a Services ID; both are accepted
const appleClientIds = () => [process.env.APPLE_BUNDLE_ID || 'com.editodo.app', process.env.APPLE_SERVICES_ID].filter(Boolean);
// Public client IDs (also shipped in client/config.js), used when .env leaves them empty
const PUBLIC_GOOGLE_CLIENT_IDS = '1066331041224-7bafibaqtumf848ud4b8782bnbmv27bf.apps.googleusercontent.com,1066331041224-bdquag9mrcdidihcshsmirti0meea1df.apps.googleusercontent.com';
const PUBLIC_KAKAO_REST_API_KEY = '79e5acf7b47637ca8b608c8f0d91f32f';
const kakaoRestKey = () => process.env.KAKAO_REST_API_KEY || PUBLIC_KAKAO_REST_API_KEY;

const googleClientIds = () => (process.env.GOOGLE_CLIENT_IDS || PUBLIC_GOOGLE_CLIENT_IDS).split(',').map((s) => s.trim()).filter(Boolean);

async function publicKeyFor(provider, kid) {
    const cached = jwksCache[provider];
    let keys = cached && Date.now() - cached.at < JWKS_TTL_MS ? cached.keys : null;
    if (!keys || !keys.some((k) => k.kid === kid)) {
        const res = await fetch(JWKS_URLS[provider]);
        if (!res.ok) throw new Error(`${provider} keys ${res.status}`);
        keys = (await res.json()).keys;
        jwksCache[provider] = { keys, at: Date.now() };
    }
    const jwk = keys.find((k) => k.kid === kid);
    if (!jwk) throw new Error(`${provider} key ${kid} not found`);
    return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

async function verifyIdToken(provider, idToken) {
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded?.header?.kid) throw new Error('malformed token');
    const key = await publicKeyFor(provider, decoded.header.kid);
    const options = provider === 'apple'
        ? { algorithms: ['RS256'], issuer: APPLE_ISSUER, audience: appleClientIds() }
        : { algorithms: ['RS256'], issuer: GOOGLE_ISSUERS, audience: googleClientIds() };
    return jwt.verify(idToken, key, options);
}

// Kakao: the app hands over the one-time authorization code (+ PKCE verifier); only the server can redeem it.
const kakaoRedirectUri = () => process.env.KAKAO_REDIRECT_URI || 'https://editodo.com/api/auth/kakao/callback';

async function verifyKakaoCode({ code, codeVerifier }) {
    if (typeof code !== 'string' || !code) throw new Error('missing code');
    const form = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: kakaoRestKey(),
        redirect_uri: kakaoRedirectUri(),
        code,
    });
    if (typeof codeVerifier === 'string') form.set('code_verifier', codeVerifier);
    if (process.env.KAKAO_CLIENT_SECRET) form.set('client_secret', process.env.KAKAO_CLIENT_SECRET);
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: form,
    });
    if (!tokenRes.ok) throw new Error(`kakao token ${tokenRes.status} ${await tokenRes.text()}`);
    const { access_token: accessToken } = await tokenRes.json();
    const meRes = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!meRes.ok) throw new Error(`kakao me ${meRes.status}`);
    const me = await meRes.json();
    const account = me.kakao_account || {};
    return {
        sub: String(me.id),
        email: account.email || null,
        emailVerified: Boolean(account.is_email_valid && account.is_email_verified),
        name: account.profile?.nickname || me.properties?.nickname || null,
    };
}

// Account deletion: disconnect the app from the user's Kakao account. Needs the app's Admin key.
async function unlinkKakao(kakaoUserId) {
    if (!process.env.KAKAO_ADMIN_KEY) return;
    const res = await fetch('https://kapi.kakao.com/v1/user/unlink', {
        method: 'POST',
        headers: { Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: new URLSearchParams({ target_id_type: 'user_id', target_id: kakaoUserId }),
    });
    if (!res.ok) throw new Error(`kakao unlink ${res.status}`);
}

// Returns { sub, email, emailVerified, name } or throws when the token isn't genuine / not for this app.
async function verifySocialToken(provider, body) {
    if (provider === 'kakao') return verifyKakaoCode(body);
    if (provider === 'apple') {
        const claims = await verifyIdToken('apple', body.identityToken);
        const name = [body.fullName?.familyName, body.fullName?.givenName].filter(Boolean).join('') || null;
        return { sub: claims.sub, email: claims.email || null, emailVerified: String(claims.email_verified) === 'true', name, clientId: claims.aud };
    }
    if (provider === 'google') {
        if (googleClientIds().length === 0) throw new Error('GOOGLE_CLIENT_IDS not set');
        const claims = await verifyIdToken('google', body.idToken);
        return { sub: claims.sub, email: claims.email || null, emailVerified: claims.email_verified === true, name: claims.name || null };
    }
    throw new Error(`unknown provider ${provider}`);
}

// --- Apple token revocation (App Store guideline 5.1.1(v)) ---
const appleKeyConfigured = () => Boolean(process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY);

function appleClientSecret(clientId) {
    const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // .env stores the .p8 on one line
    return jwt.sign({}, privateKey, {
        algorithm: 'ES256',
        keyid: process.env.APPLE_KEY_ID,
        issuer: process.env.APPLE_TEAM_ID,
        audience: APPLE_ISSUER,
        subject: clientId,
        expiresIn: '5m',
    });
}

async function appleForm(path, clientId, params) {
    const res = await fetch(`${APPLE_ISSUER}/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: clientId, client_secret: appleClientSecret(clientId), ...params }),
    });
    if (!res.ok) throw new Error(`Apple ${path} ${res.status}: ${await res.text()}`);
    return path === 'token' ? res.json() : null;
}

// Trades the one-time authorization code for a refresh token we can later revoke. null when not configured.
// clientId must be the one the code was issued to (bundle ID for iOS, Services ID for web).
async function appleRefreshToken(authorizationCode, clientId) {
    if (!appleKeyConfigured() || !authorizationCode) return null;
    const data = await appleForm('token', clientId, { code: authorizationCode, grant_type: 'authorization_code' });
    return data.refresh_token || null;
}

async function revokeAppleToken(refreshToken, clientId) {
    if (!appleKeyConfigured() || !refreshToken) return;
    await appleForm('revoke', clientId || appleClientIds()[0], { token: refreshToken, token_type_hint: 'refresh_token' });
}

module.exports = { verifySocialToken, appleRefreshToken, revokeAppleToken, unlinkKakao };
