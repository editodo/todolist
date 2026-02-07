const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin Credentials (Hardcoded for MVP)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@editodo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'editodo1234';

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
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
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
        res.status(500).json({ error: error.message });
    }
});

// Create notice
router.post('/notices', isAdmin, async (req, res) => {
    const { title, content } = req.body;
    try {
        await db.query('INSERT INTO notices (title, content) VALUES (?, ?)', [title, content]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

// Delete notice
router.delete('/notices/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM notices WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Users ---

// Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, email, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user (Force Withdraw)
router.delete('/users/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        // Basic user deletion. 
        // Note: Ideally we should use transactions to delete related data (todos, etc) if ON DELETE CASCADE isn't set in DB.
        // Assuming the schema handles cascade or we accept orphan data for this MVP.
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
