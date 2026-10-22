const express = require('express');
const router = express.Router();
const db = require('../db');

// All routes run behind requireAuth: the owner is always req.userId, never a client-sent id.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TEXT = 500;
const REPEAT_RULES = ['daily', 'weekdays', 'weekly']; // weekly = same weekday as the first day
const CARRY_DAYS = 30; // 못 한 일 가져오기 looks back this far

const isDate = (d) => typeof d === 'string' && DATE_RE.test(d);
const badDate = (res) => res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });

// Repeating to-dos: each day's copy is a normal todos row, created the first time that day is loaded.
// UNIQUE(repeat_id, target_date) keeps it to one row per day, and a deleted day stays as deleted = 1
// so it doesn't come back.
async function fillRepeats(userId, date) {
    await db.query(
        `INSERT IGNORE INTO todos (user_id, text, target_date, repeat_id)
         SELECT user_id, text, ?, id FROM todo_repeats
         WHERE user_id = ? AND start_date <= ?
           AND (rule = 'daily'
             OR (rule = 'weekdays' AND WEEKDAY(?) < 5)
             OR (rule = 'weekly' AND WEEKDAY(?) = WEEKDAY(start_date)))`,
        [date, userId, date, date, date]
    );
}

// 못 한 일: unfinished, not-repeating to-dos from the CARRY_DAYS days before `date`
const OVERDUE = `user_id = ? AND is_completed = 0 AND deleted = 0 AND repeat_id IS NULL
                 AND target_date < ? AND target_date >= DATE_SUB(?, INTERVAL ${CARRY_DAYS} DAY)`;

// GET /overdue?date=YYYY-MM-DD → { count }
router.get('/overdue', async (req, res) => {
    const { date } = req.query;
    if (!isDate(date)) return badDate(res);
    try {
        const [[row]] = await db.query(`SELECT COUNT(*) AS count FROM todos WHERE ${OVERDUE}`, [req.userId, date, date]);
        res.json({ count: Number(row.count) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /carry-over { date } → moves those to-dos to `date`
router.post('/carry-over', async (req, res) => {
    const { date } = req.body;
    if (!isDate(date)) return badDate(res);
    try {
        const [result] = await db.query(`UPDATE todos SET target_date = ? WHERE ${OVERDUE}`, [date, req.userId, date, date]);
        res.json({ moved: result.affectedRows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET Todos for the logged-in user (:userId kept for older clients, ignored)
router.get('/:userId', async (req, res) => {
    try {
        const { date } = req.query; // YYYY-MM-DD

        let query = `SELECT t.*, r.rule AS repeat_rule FROM todos t
                     LEFT JOIN todo_repeats r ON r.id = t.repeat_id
                     WHERE t.user_id = ? AND t.deleted = 0`;
        const params = [req.userId];

        if (date) {
            if (!isDate(date)) return badDate(res);
            await fillRepeats(req.userId, date);
            query += ' AND t.target_date = ?';
            params.push(date);
        }

        query += ' ORDER BY t.created_at ASC, t.id ASC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST Create Todo { text, target_date, repeat? }
router.post('/', async (req, res) => {
    try {
        const { text, target_date, repeat } = req.body;
        if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: '할 일을 입력해주세요.' });
        if (text.length > MAX_TEXT) return res.status(400).json({ error: `할 일은 ${MAX_TEXT}자까지 입력할 수 있습니다.` });
        if (target_date && !isDate(target_date)) return badDate(res);
        if (repeat && !REPEAT_RULES.includes(repeat)) return res.status(400).json({ error: '반복 설정이 올바르지 않습니다.' });

        const date = target_date || new Date().toISOString().slice(0, 10);
        let repeatId = null;
        if (repeat) {
            const [r] = await db.query('INSERT INTO todo_repeats (user_id, text, rule, start_date) VALUES (?, ?, ?, ?)', [req.userId, text, repeat, date]);
            repeatId = r.insertId;
        }
        const [result] = await db.query(
            'INSERT INTO todos (user_id, text, target_date, repeat_id) VALUES (?, ?, ?, ?)',
            [req.userId, text, date, repeatId]
        );
        res.status(201).json({ id: result.insertId, user_id: req.userId, text, target_date: date, is_completed: 0, repeat_id: repeatId, repeat_rule: repeat || null });
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

        const [result] = await db.query(`UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ? AND deleted = 0`, [...params, id, req.userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE Todo. A repeating day is hidden (deleted = 1) so it isn't recreated;
// ?scope=series also ends the repeat: the rule and this and later days go, earlier days stay as history.
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [[todo]] = await db.query("SELECT id, repeat_id, DATE_FORMAT(target_date, '%Y-%m-%d') AS day FROM todos WHERE id = ? AND user_id = ?", [id, req.userId]);
        if (!todo) return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });

        if (!todo.repeat_id) {
            await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, req.userId]);
        } else if (req.query.scope === 'series') {
            await db.query('DELETE FROM todos WHERE repeat_id = ? AND user_id = ? AND target_date >= ?', [todo.repeat_id, req.userId, todo.day]);
            await db.query('DELETE FROM todo_repeats WHERE id = ? AND user_id = ?', [todo.repeat_id, req.userId]);
        } else {
            await db.query('UPDATE todos SET deleted = 1 WHERE id = ? AND user_id = ?', [id, req.userId]);
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
