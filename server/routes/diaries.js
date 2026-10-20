const express = require('express');
const router = express.Router();
const db = require('../db');

// All routes run behind requireAuth: the owner is always req.userId; client-sent user_id is ignored.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const MAX_CONTENT = 5000;

// GET Diaries for the logged-in user, by month (YYYY-MM) or specific date (YYYY-MM-DD)
router.get('/', async (req, res) => {
    try {
        const { date, month } = req.query;

        if (date) {
            if (!DATE_RE.test(date)) return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });
            const [rows] = await db.query('SELECT user_id, DATE_FORMAT(date, "%Y-%m-%d") as date, content, emotion FROM diaries WHERE user_id = ? AND date = ?', [req.userId, date]);
            return res.json(rows[0] || null);
        }

        if (month) {
            if (!MONTH_RE.test(month)) return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });
            const [rows] = await db.query(
                'SELECT DATE_FORMAT(date, "%Y-%m-%d") as date, emotion, content FROM diaries WHERE user_id = ? AND DATE_FORMAT(date, "%Y-%m") = ?',
                [req.userId, month]
            );
            return res.json(rows);
        }

        res.status(400).json({ error: 'Date or Month required' });
    } catch (error) {
        console.error('Get Diaries Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST/PUT Upsert Diary
router.post('/', async (req, res) => {
    try {
        const { date, content, emotion } = req.body;

        if (!date || !content || !emotion) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!DATE_RE.test(date)) return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });
        if (typeof content !== 'string' || content.length > MAX_CONTENT) {
            return res.status(400).json({ error: `일기는 ${MAX_CONTENT}자까지 입력할 수 있습니다.` });
        }

        // Upsert syntax for MySQL
        const query = `
            INSERT INTO diaries (user_id, date, content, emotion)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE content = VALUES(content), emotion = VALUES(emotion)
        `;
        await db.query(query, [req.userId, date, content, emotion]);
        res.json({ success: true });
    } catch (error) {
        console.error('Save Diary Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE Diary
router.delete('/', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date || !DATE_RE.test(date)) return res.status(400).json({ error: 'Date required' });

        await db.query('DELETE FROM diaries WHERE user_id = ? AND date = ?', [req.userId, date]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete Diary Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
