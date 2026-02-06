
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET Diaries for a specific user and month (YYYY-MM) or specific date (YYYY-MM-DD)
router.get('/', async (req, res) => {
    try {
        const { user_id, date, month } = req.query; // date: '2024-01-01', month: '2024-01'

        if (!user_id) return res.status(400).json({ error: 'User ID required' });

        if (date) {
            // Updated to return formatted date string
            const [rows] = await db.query('SELECT user_id, DATE_FORMAT(date, "%Y-%m-%d") as date, content, emotion FROM diaries WHERE user_id = ? AND date = ?', [user_id, date]);
            return res.json(rows[0] || null);
        }

        if (month) {
            // Updated to return formatted date string
            const [rows] = await db.query(
                'SELECT DATE_FORMAT(date, "%Y-%m-%d") as date, emotion, content FROM diaries WHERE user_id = ? AND DATE_FORMAT(date, "%Y-%m") = ?',
                [user_id, month]
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
        const { user_id, date, content, emotion } = req.body;
        console.log('Saving Diary:', { user_id, date, content, emotion });

        if (!user_id || !date || !content || !emotion) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Upsert syntax for MySQL
        const query = `
            INSERT INTO diaries (user_id, date, content, emotion)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE content = VALUES(content), emotion = VALUES(emotion)
        `;
        await db.query(query, [user_id, date, content, emotion]);
        res.json({ success: true });
    } catch (error) {
        console.error('Save Diary Error:', error);
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// DELETE Diary
router.delete('/', async (req, res) => {
    try {
        const { user_id, date } = req.query;
        if (!user_id || !date) return res.status(400).json({ error: 'User ID and Date required' });

        await db.query('DELETE FROM diaries WHERE user_id = ? AND date = ?', [user_id, date]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete Diary Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
