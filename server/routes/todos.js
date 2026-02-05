
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET Todos for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { date } = req.query; // YYYY-MM-DD

        let query = 'SELECT * FROM todos WHERE user_id = ?';
        const params = [userId];

        if (date) {
            query += ' AND target_date = ?';
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
        const { user_id, text, target_date } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        const [result] = await db.query(
            'INSERT INTO todos (user_id, text, target_date) VALUES (?, ?, ?)',
            [user_id, text, target_date || new Date()]
        );
        const newTodo = { id: result.insertId, user_id, text, target_date, is_completed: 0 };
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// PUT Toggle Complete
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body; // Expect boolean or 0/1

        await db.query('UPDATE todos SET is_completed = ? WHERE id = ?', [is_completed, id]);
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
        await db.query('DELETE FROM todos WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
