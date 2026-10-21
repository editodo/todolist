const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 사용자 환경설정 저장/업데이트 (Save/Update User Preferences)
// POST /api/preferences
router.post('/', async (req, res) => {
    // Only the fields sent are changed, so the app can save one setting (e.g. the font) on its own
    const FIELDS = {
        mode: (v) => ['light', 'dark', 'system'].includes(v),
        theme: (v) => typeof v === 'string' && v.length <= 50,
        color_theme: (v) => typeof v === 'string' && v.length <= 50,
        font_id: (v) => v === null || Number.isInteger(v),
        language: (v) => v === null || ['ko', 'en'].includes(v), // null = follow the device
    };
    const cols = Object.keys(FIELDS).filter((k) => req.body[k] !== undefined);
    const bad = cols.find((k) => !FIELDS[k](req.body[k]));
    if (bad) return res.status(400).json({ error: `잘못된 설정 값입니다: ${bad}` });
    if (cols.length === 0) return res.status(400).json({ error: '저장할 설정이 없습니다.' });

    try {
        await db.query(
            `INSERT INTO user_preferences (user_id, ${cols.join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})
             ON DUPLICATE KEY UPDATE ${cols.map((c) => `${c} = VALUES(${c})`).join(', ')}`,
            [req.userId, ...cols.map((c) => req.body[c])]
        );
        res.status(200).json({ message: '환경설정이 저장되었습니다.' });
    } catch (error) {
        console.error('Save Preferences Error:', error);
        res.status(500).json({ error: '환경설정 저장 중 오류 발생' });
    }
});

// ✅ 사용자 환경설정 조회 (Get User Preferences)
// GET /api/preferences/:user_id (param kept for older clients, the logged-in user is used)
router.get('/:user_id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [req.userId]
        );

        if (rows.length === 0) {
            // Return defaults instead of 404 to allow guest/new users to function
            return res.status(200).json({
                user_id: req.userId,
                mode: 'light',
                theme: 'basic',
                color_theme: 'blue'
            });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Get Preferences Error:', error);
        res.status(500).json({ error: '조회 중 오류 발생' });
    }
});

module.exports = router;
