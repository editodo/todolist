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

const appleClientId = () => process.env.APPLE_BUNDLE_ID || 'com.editodo.app';
const googleClientIds = () => (process.env.GOOGLE_CLIENT_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);

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
        ? { algorithms: ['RS256'], issuer: APPLE_ISSUER, audience: appleClientId() }
        : { algorithms: ['RS256'], issuer: GOOGLE_ISSUERS, audience: googleClientIds() };
    return jwt.verify(idToken, key, options);
}

// Returns { sub, email, emailVerified, name } or throws when the token isn't genuine / not for this app.
async function verifySocialToken(provider, body) {
    if (provider === 'apple') {
        const claims = await verifyIdToken('apple', body.identityToken);
        const name = [body.fullName?.familyName, body.fullName?.givenName].filter(Boolean).join('') || null;
        return { sub: claims.sub, email: claims.email || null, emailVerified: String(claims.email_verified) === 'true', name };
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

function appleClientSecret() {
    const privateKey = process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // .env stores the .p8 on one line
    return jwt.sign({}, privateKey, {
        algorithm: 'ES256',
        keyid: process.env.APPLE_KEY_ID,
        issuer: process.env.APPLE_TEAM_ID,
        audience: APPLE_ISSUER,
        subject: appleClientId(),
        expiresIn: '5m',
    });
}

async function appleForm(path, params) {
    const res = await fetch(`${APPLE_ISSUER}/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: appleClientId(), client_secret: appleClientSecret(), ...params }),
    });
    if (!res.ok) throw new Error(`Apple ${path} ${res.status}: ${await res.text()}`);
    return path === 'token' ? res.json() : null;
}

// Trades the one-time authorization code for a refresh token we can later revoke. null when not configured.
async function appleRefreshToken(authorizationCode) {
    if (!appleKeyConfigured() || !authorizationCode) return null;
    const data = await appleForm('token', { code: authorizationCode, grant_type: 'authorization_code' });
    return data.refresh_token || null;
}

async function revokeAppleToken(refreshToken) {
    if (!appleKeyConfigured() || !refreshToken) return;
    await appleForm('revoke', { token: refreshToken, token_type_hint: 'refresh_token' });
}

module.exports = { verifySocialToken, appleRefreshToken, revokeAppleToken };
