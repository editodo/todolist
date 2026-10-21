// Run: npm test  (no database or network: provider keys and tables are stubbed)
const test = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';
process.env.GOOGLE_CLIENT_IDS = 'web-client.apps.googleusercontent.com';
process.env.APPLE_SERVICES_ID = 'com.editodo.web';
process.env.KAKAO_REST_API_KEY = 'kakao-rest';

// Act as Apple and Google: our own key pair, published through a stubbed JWKS endpoint
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const realFetch = global.fetch;
global.fetch = async (url, opts) => {
    if (/appleid\.apple\.com\/auth\/keys|googleapis\.com\/oauth2\/v3\/certs/.test(String(url))) {
        return { ok: true, json: async () => ({ keys: [jwk] }) };
    }
    // Act as Kakao: only the code 'good' with its verifier redeems, for our REST key
    if (String(url) === 'https://kauth.kakao.com/oauth/token') {
        const f = opts.body;
        const ok = f.get('code') === 'good' && f.get('code_verifier') === 'v1' && f.get('client_id') === 'kakao-rest';
        return { ok, status: ok ? 200 : 400, text: async () => 'bad', json: async () => ({ access_token: 'at' }) };
    }
    if (String(url) === 'https://kapi.kakao.com/v2/user/me') {
        return { ok: true, json: async () => ({ id: 42, kakao_account: { email: 'k@kakao.com', is_email_valid: true, is_email_verified: true, profile: { nickname: '카카오' } } }) };
    }
    return realFetch(url, opts);
};
const sign = (claims, key = privateKey) => jwt.sign(claims, key, { algorithm: 'RS256', keyid: 'k1', expiresIn: '5m' });
const appleToken = (extra = {}) => sign({ iss: 'https://appleid.apple.com', aud: 'com.editodo.app', sub: 'apple-1', email: 'a@privaterelay.appleid.com', email_verified: 'true', ...extra });
const googleToken = (extra = {}) => sign({ iss: 'https://accounts.google.com', aud: 'web-client.apps.googleusercontent.com', sub: 'g-1', email: 'minji@gmail.com', email_verified: true, name: '민지', ...extra });

// In-memory users / social_accounts / user_preferences
const users = [{ id: 1, username: 'guest_abc', nickname: '배고픈쿼카1', email: null, user_type: 'GUEST', expires_at: new Date() }];
const links = [];
const db = require('./db');
db.query = async (sql, p) => {
    if (sql.startsWith('SELECT user_id FROM social_accounts')) return [links.filter((l) => l.provider === p[0] && l.sub === p[1])];
    if (sql.includes("WHERE id = ? AND user_type = 'GUEST'")) return [users.filter((u) => u.id === p[0] && u.user_type === 'GUEST')];
    if (sql.includes("WHERE email = ? AND user_type = 'REGULAR'")) return [users.filter((u) => u.email === p[0] && u.user_type === 'REGULAR')];
    if (sql.startsWith('SELECT id FROM users WHERE email = ? AND id != ?')) return [users.filter((u) => u.email === p[0] && u.id !== p[1])];
    if (sql.startsWith('SELECT id FROM users WHERE email = ?')) return [users.filter((u) => u.email === p[0])];
    if (sql.startsWith("UPDATE users SET user_type = 'REGULAR'")) { Object.assign(users.find((u) => u.id === p[2]), { user_type: 'REGULAR', expires_at: null, email: p[0], nickname: p[1] ?? users.find((u) => u.id === p[2]).nickname }); return [{}]; }
    if (sql.startsWith('INSERT INTO users')) { const id = users.length + 1; users.push({ id, username: p[0], nickname: p[1], email: p[2], user_type: 'REGULAR' }); return [{ insertId: id }]; }
    if (sql.startsWith('INSERT INTO social_accounts')) { links.push({ provider: p[0], sub: p[1], user_id: p[2] }); return [{}]; }
    if (sql.startsWith('SELECT * FROM users WHERE id = ?')) return [users.filter((u) => u.id === p[0])];
    if (sql.startsWith('SELECT * FROM user_preferences')) return [[]];
    throw new Error(`unexpected SQL: ${sql}`);
};

const { verifySocialToken } = require('./social');

test('genuine Apple and Google tokens are accepted', async () => {
    assert.strictEqual((await verifySocialToken('apple', { identityToken: appleToken() })).sub, 'apple-1');
    const g = await verifySocialToken('google', { idToken: googleToken() });
    assert.deepStrictEqual([g.sub, g.email, g.emailVerified, g.name], ['g-1', 'minji@gmail.com', true, '민지']);
});

test('Apple web sign-in (Services ID) is accepted and remembers which client issued it', async () => {
    const web = await verifySocialToken('apple', { identityToken: appleToken({ aud: 'com.editodo.web' }) });
    assert.strictEqual(web.clientId, 'com.editodo.web');
    const ios = await verifySocialToken('apple', { identityToken: appleToken() });
    assert.strictEqual(ios.clientId, 'com.editodo.app');
});

test('tokens for another app, forged, or expired are rejected', async () => {
    await assert.rejects(verifySocialToken('apple', { identityToken: appleToken({ aud: 'com.someone.else' }) }));
    await assert.rejects(verifySocialToken('google', { idToken: googleToken({ iss: 'https://evil.example' }) }));
    const { privateKey: otherKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    await assert.rejects(verifySocialToken('google', { idToken: sign({ iss: 'https://accounts.google.com', aud: 'web-client.apps.googleusercontent.com', sub: 'x' }, otherKey) }));
    const expired = jwt.sign({ iss: 'https://appleid.apple.com', aud: 'com.editodo.app', sub: 's', exp: Math.floor(Date.now() / 1000) - 60 }, privateKey, { algorithm: 'RS256', keyid: 'k1' });
    await assert.rejects(verifySocialToken('apple', { identityToken: expired }));
});

// Route flow over HTTP
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
let base;
const server = app.listen(0, () => { base = `http://localhost:${server.address().port}/api/auth/social`; });
test.after(() => server.close());
const post = (path, body, token) => realFetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
});

test('guest signing in with Google keeps their account and data', async () => {
    const guestToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
    const r = await post('/google', { idToken: googleToken() }, guestToken);
    const data = await r.json();
    assert.strictEqual(r.status, 200);
    assert.strictEqual(data.user.id, 1);
    assert.strictEqual(data.user.user_type, 'REGULAR');
    assert.strictEqual(data.isNew, false);
    assert.ok(data.token);
});

test('same Google account later logs into the same user', async () => {
    const data = await (await post('/google', { idToken: googleToken() })).json();
    assert.strictEqual(data.user.id, 1);
});

test('new Apple user gets a new account and goes through onboarding', async () => {
    const data = await (await post('/apple', { identityToken: appleToken(), fullName: { familyName: '김', givenName: '하늘' } })).json();
    assert.strictEqual(data.isNew, true);
    assert.strictEqual(data.user.nickname, '김하늘');
    assert.match(data.user.username, /^apple_[0-9a-f]{16}$/);
});

test('bad token gets 401, unknown provider 404', async () => {
    assert.strictEqual((await post('/google', { idToken: 'not-a-token' })).status, 401);
    assert.strictEqual((await post('/naver', {})).status, 404);
});

test('Kakao code + PKCE verifier signs in; a wrong verifier is rejected', async () => {
    const k = await verifySocialToken('kakao', { code: 'good', codeVerifier: 'v1' });
    assert.deepStrictEqual([k.sub, k.email, k.emailVerified, k.name], ['42', 'k@kakao.com', true, '카카오']);
    await assert.rejects(verifySocialToken('kakao', { code: 'good', codeVerifier: 'stolen-code-no-verifier' }));
    const r = await post('/kakao', { code: 'good', codeVerifier: 'v1' });
    assert.strictEqual(r.status, 200);
    assert.strictEqual((await r.json()).user.nickname, '카카오');
});

test('Kakao callback hands the code to the app scheme, or to the web opener without breaking out of the script', async () => {
    const cb = base.replace('/social', '/kakao/callback');
    const app = await realFetch(`${cb}?code=c1&state=s.app`, { redirect: 'manual' });
    assert.strictEqual(app.headers.get('location'), 'editodo://auth/kakao?code=c1&state=s.app&error=');
    const web = await (await realFetch(`${cb}?code=${encodeURIComponent('</script><script>x')}&state=s.web`)).text();
    assert.ok(!web.includes('</script><script>x'));
    assert.ok(web.includes('"https://editodo.com"'));
});

test('guest converting with an SNS account that already belongs to a member is refused, guest kept', async () => {
    users.push({ id: 99, username: 'guest_xyz', nickname: '졸린토끼', email: null, user_type: 'GUEST' });
    const r = await post('/google', { idToken: googleToken() }, jwt.sign({ userId: 99 }, process.env.JWT_SECRET)); // g-1 is linked to user 1
    assert.strictEqual(r.status, 409);
    assert.strictEqual(users.find((u) => u.id === 99).user_type, 'GUEST');
});
