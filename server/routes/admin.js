const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const { deleteUser } = require('../auth');

// Admin credentials come only from env; when unset, admin login is disabled
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Constant-time compare so the password can't be guessed from response timing
const safeEqual = (a, b) => {
    const x = Buffer.from(String(a ?? ''));
    const y = Buffer.from(String(b ?? ''));
    return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// Middleware to check admin session
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (ADMIN_EMAIL && ADMIN_PASSWORD && safeEqual(email, ADMIN_EMAIL) && safeEqual(password, ADMIN_PASSWORD)) {
        req.session.isAdmin = true;
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // 1 day
        req.session.save();
        return res.json({ success: true });
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Check Auth Status
router.get('/check', (req, res) => {
    res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

// --- Notices ---

// Get all notices
router.get('/notices', isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notices ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Create notice
router.post('/notices', isAdmin, async (req, res) => {
    const { title, content } = req.body;
    try {
        await db.query('INSERT INTO notices (title, content) VALUES (?, ?)', [title, content]);
        res.json({ success: true });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Update notice
router.put('/notices/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        await db.query('UPDATE notices SET title = ?, content = ? WHERE id = ?', [title, content, id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Delete notice
router.delete('/notices/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM notices WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- Users ---

// Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, email, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Delete user (Force Withdraw)
router.delete('/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await deleteUser(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- Fonts (글꼴 변경 catalog) ---
const fonts = require('./fonts');

// Add a web font: { name, url } where url is a direct https link to a font file
router.post('/fonts', isAdmin, async (req, res) => {
    const { name, url } = req.body;
    if (!fonts.validName(name)) return res.status(400).json({ error: '글꼴 이름은 1~30자로 입력해주세요.' });
    const urlError = fonts.checkWebFontUrl(url);
    if (urlError) return res.status(400).json({ error: urlError });
    try {
        const [r] = await db.query("INSERT INTO fonts (name, url, source) VALUES (?, ?, 'web')", [name.trim(), url]);
        res.json({ success: true, id: r.insertId });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Upload a font file: raw bytes in the body; name and original file name in headers (URI-encoded)
router.post('/fonts/upload', isAdmin, express.raw({ type: '*/*', limit: fonts.MAX_BYTES }), async (req, res) => {
    try {
        const name = decodeURIComponent(req.get('x-font-name') || '');
        const fileName = decodeURIComponent(req.get('x-file-name') || '');
        const result = await fonts.saveUploadedFont(name, fileName, req.body);
        if (result.error) return res.status(400).json({ error: result.error });
        res.json({ success: true, id: result.id });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.delete('/fonts/:id', isAdmin, async (req, res) => {
    try {
        const ok = await fonts.deleteFont(Number(req.params.id));
        if (!ok) return res.status(404).json({ error: '글꼴을 찾을 수 없습니다.' });
        res.json({ success: true });
    } catch (error) {
        console.error('Admin Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
