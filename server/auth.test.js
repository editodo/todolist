// Run: npm test  (no database needed; the DB lookup is stubbed)
const test = require('node:test');
const assert = require('node:assert');

process.env.JWT_SECRET = 'test-secret';
const db = require('./db');
db.query = async (sql, params) => [params[0] === 1 ? [{ id: 1 }] : []];
const jwt = require('jsonwebtoken');
const { signToken, requireAuth } = require('./auth');

function run(authorization) {
    const req = { headers: authorization ? { authorization } : {} };
    const res = { statusCode: 200, status(c) { this.statusCode = c; return this; }, json() { return this; } };
    let passed = false;
    return requireAuth(req, res, () => { passed = true; }).then(() => ({ req, res, passed }));
}

test('valid token sets req.userId from the token', async () => {
    const { req, passed } = await run(`Bearer ${signToken(1)}`);
    assert.strictEqual(passed, true);
    assert.strictEqual(req.userId, 1);
});

test('missing token is rejected', async () => {
    const { res, passed } = await run();
    assert.strictEqual(passed, false);
    assert.strictEqual(res.statusCode, 401);
});

test('token signed with another secret is rejected', async () => {
    const forged = jwt.sign({ userId: 1 }, 'not-the-secret');
    const { res, passed } = await run(`Bearer ${forged}`);
    assert.strictEqual(passed, false);
    assert.strictEqual(res.statusCode, 401);
});

test('token of a deleted user is rejected', async () => {
    const { res, passed } = await run(`Bearer ${signToken(2)}`);
    assert.strictEqual(passed, false);
    assert.strictEqual(res.statusCode, 401);
});
