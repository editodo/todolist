// Run: npm test  (no database: queries are stubbed; uploads go to a temp folder)
const test = require('node:test');
const assert = require('node:assert');
const os = require('os');
const path = require('path');
const fs = require('fs');

process.env.JWT_SECRET = 'test-secret';
process.env.FONT_UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'fonts-'));

const queries = [];
const db = require('./db');
db.query = async (sql, params) => { queries.push({ sql, params }); return [{ insertId: 9, affectedRows: 1 }]; };
const fonts = require('./routes/fonts');

const ttf = Buffer.concat([Buffer.from('00010000', 'hex'), Buffer.alloc(100)]);

test('web font URL must be an https link to a font file', () => {
    assert.strictEqual(fonts.checkWebFontUrl('https://cdn.example.com/a/Jua-Regular.ttf'), null);
    assert.ok(fonts.checkWebFontUrl('http://cdn.example.com/a.ttf'));                       // not https
    assert.ok(fonts.checkWebFontUrl('https://fonts.googleapis.com/css2?family=Jua'));        // CSS page, not a font file
    assert.ok(fonts.checkWebFontUrl('javascript:alert(1)'));
});

test('uploaded bytes must match the font type', () => {
    assert.strictEqual(fonts.checkFontFile(ttf, '.ttf'), null);
    assert.ok(fonts.checkFontFile(Buffer.from('<html>not a font</html>'), '.ttf'));        // wrong signature
    assert.ok(fonts.checkFontFile(ttf, '.exe'));                                            // wrong extension
    assert.ok(fonts.checkFontFile(Buffer.alloc(fonts.MAX_BYTES + 1, 0), '.ttf'));           // too big
});

test('upload is stored under a random name, never the client-provided one', async () => {
    const r = await fonts.saveUploadedFont('내 글꼴', '../../etc/passwd.ttf', ttf);
    assert.strictEqual(r.id, 9);
    const insert = queries.at(-1);
    const stored = insert.params[2];
    assert.match(stored, /^[0-9a-f]{24}\.ttf$/);
    assert.ok(fs.existsSync(path.join(process.env.FONT_UPLOAD_DIR, stored)));
});

test('preferences save only the fields sent', async () => {
    const express = require('express');
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => { req.userId = 5; next(); });
    app.use('/p', require('./routes/preferences'));
    const server = await new Promise((r) => { const s = app.listen(0, () => r(s)); });
    const url = `http://localhost:${server.address().port}/p`;
    const post = (body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

    queries.length = 0;
    assert.strictEqual((await post({ font_id: 3 })).status, 200);
    assert.match(queries[0].sql, /\(user_id, font_id\)/);
    assert.doesNotMatch(queries[0].sql, /mode|color_theme/);
    assert.deepStrictEqual(queries[0].params, [5, 3]);

    assert.strictEqual((await post({ language: 'jp' })).status, 400);
    assert.strictEqual((await post({ mode: 'neon' })).status, 400);
    assert.strictEqual((await post({})).status, 400);
    server.close();
});
