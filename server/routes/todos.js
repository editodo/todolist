const express = require('express');
const router = express.Router();
const db = require('../db');

// All routes run behind requireAuth: the owner is always req.userId, never a client-sent id.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TEXT = 500;

// GET Todos for the logged-in user (:userId kept for older clients, ignored)
router.get('/:userId', async (req, res) => {
    try {
        const { date } = req.query; // YYYY-MM-DD

        let query = 'SELECT * FROM todos WHERE user_id = ?';
        const params = [req.userId];

        if (date) {
            if (!DATE_RE.test(date)) return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });
            query += ' AND DATE(target_date) = ?';
            params.push(date);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST Create Todo
router.post('/', async (req, res) => {
    try {
        const { text, target_date } = req.body;
        if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: '할 일을 입력해주세요.' });
        if (text.length > MAX_TEXT) return res.status(400).json({ error: `할 일은 ${MAX_TEXT}자까지 입력할 수 있습니다.` });
        if (target_date && !DATE_RE.test(target_date)) return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });

        const [result] = await db.query(
            'INSERT INTO todos (user_id, text, target_date) VALUES (?, ?, ?)',
            [req.userId, text, target_date || new Date()]
        );
        const newTodo = { id: result.insertId, user_id: req.userId, text, target_date, is_completed: 0 };
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// PUT Update text and/or completion: { text?, is_completed? }
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, is_completed } = req.body;
        const sets = [];
        const params = [];

        if (text !== undefined) {
            if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: '할 일을 입력해주세요.' });
            if (text.length > MAX_TEXT) return res.status(400).json({ error: `할 일은 ${MAX_TEXT}자까지 입력할 수 있습니다.` });
            sets.push('text = ?');
            params.push(text);
        }
        if (is_completed !== undefined) {
            sets.push('is_completed = ?');
            params.push(is_completed ? 1 : 0);
        }
        if (sets.length === 0) return res.status(400).json({ error: '변경할 내용이 없습니다.' });

        const [result] = await db.query(`UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, [...params, id, req.userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE Todo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, req.userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
