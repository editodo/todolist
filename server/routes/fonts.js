const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('../db');

// Font catalog for the 글꼴 변경 menu. Two kinds of entries:
// - web: a direct font-file URL (ttf/otf/woff/woff2) on another host, e.g. Google Fonts via jsDelivr
// - upload: a file an admin uploaded; stored outside the code folder so deploys don't wipe it
const UPLOAD_DIR = process.env.FONT_UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads', 'fonts');
const FILE_URL_PREFIX = '/api/fonts/files/';
const MAX_BYTES = 15 * 1024 * 1024;
const EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];
const MAGIC = { '.ttf': ['00010000', '74727565'], '.otf': ['4f54544f'], '.woff': ['774f4646'], '.woff2': ['774f4632'] };

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Seeded once when the table is empty: free (OFL) Korean Google Fonts
const DEFAULT_WEB_FONTS = [
    ['주아', 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/jua/Jua-Regular.ttf'],
    ['고운돋움', 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/gowundodum/GowunDodum-Regular.ttf'],
    ['나눔손글씨 펜', 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumpenscript/NanumPenScript-Regular.ttf'],
    ['도현', 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/dohyeon/DoHyeon-Regular.ttf'],
    ['개구', 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/gaegu/Gaegu-Regular.ttf'],
    ['나눔명조', 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanummyeongjo/NanumMyeongjo-Regular.ttf'],
];

async function ensureFontTables() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS fonts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        url VARCHAR(500) NOT NULL,
        source ENUM('web', 'upload') NOT NULL,
        file_name VARCHAR(100) NULL,
        sort INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);
    const [[{ n }]] = await db.query('SELECT COUNT(*) AS n FROM fonts');
    if (n === 0) {
        for (const [i, [name, url]] of DEFAULT_WEB_FONTS.entries()) {
            await db.query("INSERT INTO fonts (name, url, source, sort) VALUES (?, ?, 'web', ?)", [name, url, i + 1]);
        }
    }
}

const validName = (name) => typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= 30;

// Web font: must be a direct https link to a font file (not a Google Fonts CSS page)
function checkWebFontUrl(url) {
    if (typeof url !== 'string' || url.length > 500) return '주소가 올바르지 않습니다.';
    let u;
    try { u = new URL(url); } catch (e) { return '주소가 올바르지 않습니다.'; }
    if (u.protocol !== 'https:') return 'https 주소만 등록할 수 있습니다.';
    if (!EXTENSIONS.includes(path.extname(u.pathname).toLowerCase())) return '글꼴 파일(.ttf .otf .woff .woff2) 주소를 입력해주세요.';
    return null;
}

// Uploaded bytes must really be a font of the claimed type
function checkFontFile(buf, ext) {
    if (!EXTENSIONS.includes(ext)) return '.ttf .otf .woff .woff2 파일만 올릴 수 있습니다.';
    if (!buf || buf.length < 12) return '파일이 비어 있습니다.';
    if (buf.length > MAX_BYTES) return '15MB 이하 파일만 올릴 수 있습니다.';
    if (!MAGIC[ext].includes(buf.subarray(0, 4).toString('hex'))) return '글꼴 파일이 아니거나 확장자가 맞지 않습니다.';
    return null;
}

async function saveUploadedFont(name, originalName, buf) {
    const ext = path.extname(originalName || '').toLowerCase();
    const err = !validName(name) ? '글꼴 이름은 1~30자로 입력해주세요.' : checkFontFile(buf, ext);
    if (err) return { error: err };
    const fileName = crypto.randomBytes(12).toString('hex') + ext; // never trust the client's file name on disk
    fs.writeFileSync(path.join(UPLOAD_DIR, fileName), buf);
    const [r] = await db.query(
        "INSERT INTO fonts (name, url, source, file_name) VALUES (?, ?, 'upload', ?)",
        [name.trim(), FILE_URL_PREFIX + fileName, fileName]
    );
    return { id: r.insertId };
}

async function deleteFont(id) {
    const [rows] = await db.query('SELECT file_name FROM fonts WHERE id = ?', [id]);
    if (rows.length === 0) return false;
    await db.query('DELETE FROM fonts WHERE id = ?', [id]);
    await db.query('UPDATE user_preferences SET font_id = NULL WHERE font_id = ?', [id]); // users fall back to the default font
    if (rows[0].file_name) fs.rmSync(path.join(UPLOAD_DIR, path.basename(rows[0].file_name)), { force: true });
    return true;
}

// Public routes: GET /api/fonts (catalog) and GET /api/fonts/files/:name (uploaded files)
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, url, source FROM fonts ORDER BY sort, id');
        res.json(rows);
    } catch (error) {
        console.error('Get Fonts Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
router.use('/files', express.static(UPLOAD_DIR, { maxAge: '30d', fallthrough: false, index: false, dotfiles: 'deny' }));

module.exports = { router, ensureFontTables, checkWebFontUrl, validName, saveUploadedFont, deleteFont, checkFontFile, MAX_BYTES };
