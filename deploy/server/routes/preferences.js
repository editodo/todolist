const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 사용자 환경설정 저장/업데이트 (Save/Update User Preferences)
// POST /api/preferences
router.post('/', async (req, res) => {
    const { user_id, mode, theme, color_theme } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id가 필요합니다.' });
    }

    try {
        // ON DUPLICATE KEY UPDATE를 사용하여 존재하면 업데이트, 없으면 삽입
        const [result] = await db.query(`
            INSERT INTO user_preferences (user_id, mode, theme, color_theme)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            mode = VALUES(mode),
            theme = VALUES(theme),
            color_theme = VALUES(color_theme)
        `, [user_id, mode, theme, color_theme]);

        res.status(200).json({ message: '환경설정이 저장되었습니다.' });
    } catch (error) {
        console.error('Save Preferences Error:', error);
        res.status(500).json({ error: '환경설정 저장 중 오류 발생' });
    }
});

// ✅ 사용자 환경설정 조회 (Get User Preferences)
// GET /api/preferences/:user_id
router.get('/:user_id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [req.params.user_id]
        );

        if (rows.length === 0) {
            // Return defaults instead of 404 to allow guest/new users to function
            return res.status(200).json({
                user_id: req.params.user_id,
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
