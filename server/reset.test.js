// Run: npm test  (no database or Resend account needed; both are stubbed)
const test = require('node:test');
const assert = require('node:assert');

process.env.JWT_SECRET = 'test-secret';
process.env.RESEND_API_KEY = 're_test';
process.env.MAIL_FROM = 'EdiTodo <no-reply@example.com>';

// In-memory stand-in for the two tables the reset flow touches
const users = [{ id: 7, username: 'minji', email: 'minji@example.com', user_type: 'REGULAR', password_hash: 'old' }];
let reset = null;
const db = require('./db');
db.query = async (sql, p) => {
    if (sql.includes('SELECT id, username FROM users')) return [users.filter((u) => u.email === p[0])];
    if (sql.includes('REPLACE INTO password_resets')) { reset = { user_id: p[0], code_hash: p[1], attempts: 0, valid: 1 }; return [{}]; }
    if (sql.includes('FROM password_resets r')) return [reset && users.find((u) => u.id === reset.user_id).email === p[0] ? [reset] : []];
    if (sql.includes('SET attempts = attempts + 1')) { reset.attempts += 1; return [{}]; }
    if (sql.includes('UPDATE users SET password_hash')) { users[0].password_hash = p[0]; return [{}]; }
    if (sql.includes('DELETE FROM password_resets')) { reset = null; return [{}]; }
    throw new Error(`unexpected SQL: ${sql}`);
};

// Capture outgoing mail instead of calling Resend
const sent = [];
const realFetch = global.fetch;
global.fetch = async (url, opts) => {
    if (String(url).startsWith('https://api.resend.com')) { sent.push(JSON.parse(opts.body)); return { ok: true }; }
    return realFetch(url, opts);
};

const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
let base;
const server = app.listen(0, () => { base = `http://localhost:${server.address().port}/api/auth`; });
test.after(() => server.close());

const post = (path, body) => realFetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('unknown email gets the same answer and no mail', async () => {
    const r = await post('/password-reset/request', { email: 'nobody@example.com' });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(sent.length, 0);
});

test('reset by emailed code: wrong code counted, right code changes password', async () => {
    const r = await post('/password-reset/request', { email: 'minji@example.com' });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(sent.length, 1);
    assert.match(sent[0].text, /아이디: minji/);
    const code = sent[0].text.match(/인증 코드: (\d{6})/)[1];

    const wrong = await post('/password-reset/confirm', { email: 'minji@example.com', code: code === '000000' ? '111111' : '000000', password: 'newpassword1' });
    assert.strictEqual(wrong.status, 400);
    assert.strictEqual(reset.attempts, 1);
    assert.strictEqual(users[0].password_hash, 'old');

    const ok = await post('/password-reset/confirm', { email: 'minji@example.com', code, password: 'newpassword1' });
    assert.strictEqual(ok.status, 200);
    assert.notStrictEqual(users[0].password_hash, 'old');
    assert.strictEqual(reset, null);
});

test('locked after too many wrong codes', async () => {
    await post('/password-reset/request', { email: 'minji@example.com' });
    reset.attempts = 5;
    const code = sent.at(-1).text.match(/인증 코드: (\d{6})/)[1];
    const r = await post('/password-reset/confirm', { email: 'minji@example.com', code, password: 'newpassword2' });
    assert.strictEqual(r.status, 400);
});
