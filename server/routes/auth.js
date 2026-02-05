const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // Password hashing (Install needed: npm install bcrypt)

// ✅ 게스트 로그인 (Guest Login)
// POST /api/auth/guest-login
router.post('/guest-login', async (req, res) => {
    try {
        // 임시 게스트 아이디 생성 (예: guest_1712345678)
        const guestUsername = `guest_${Date.now()}`;

        const [result] = await db.query(
            'INSERT INTO users (username, user_type) VALUES (?, ?)',
            [guestUsername, 'GUEST']
        );

        const newUserId = result.insertId;

        res.status(201).json({
            message: '게스트 로그인 성공',
            user: {
                id: newUserId,
                username: guestUsername,
                user_type: 'GUEST'
            },
            isNew: true // 체험 단계(STEP01)로 가야 함을 알림
        });
    } catch (error) {
        console.error('Guest Login Error:', error);
        res.status(500).json({ error: '게스트 계정 생성 중 오류 발생' });
    }
});

// ✅ 회원가입 (Register)
// POST /api/auth/join
router.post('/join', async (req, res) => {
    const { username, email, password, phone_number } = req.body;

    try {
        // 1. 필수 값 체크
        if (!username || !email || !password) {
            return res.status(400).json({ error: '필수 정보를 모두 입력해주세요.' });
        }

        // 2. 중복 체크 (아이디 또는 이메일)
        const [existing] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: '이미 존재하는 아이디 혹은 이메일입니다.' });
        }

        // 3. 비밀번호 암호화 (보안 필수!)
        // 해시(Hash)는 비밀번호를 알아볼 수 없는 문자열로 바꿉니다.
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        // 4. DB 저장 (기존 게스트 유저가 있다면 변환 로직이 필요할 수 있지만, 여기서는 신규 생성)
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, phone_number, user_type) VALUES (?, ?, ?, ?, ?)',
            [username, email, hash, phone_number, 'REGULAR']
        );

        res.status(201).json({ message: '회원가입 성공!', userId: result.insertId });

    } catch (error) {
        console.error('Join Error:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// ✅ 로그인 (Login)
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. 사용자 찾기
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });
        }

        const user = users[0];

        // 2. 비밀번호 확인
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        // 3. 성공 (실무에서는 여기서 JWT 토큰을 발급해야 합니다)
        // 일단은 성공 메시지와 user 기본 정보만 리턴
        res.status(200).json({
            message: '로그인 성공',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                mode: user.mode || 'system' // 나중에 user_preferences 조인 필요
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: '로그인 중 오류 발생' });
    }
});

// ✅ 데이터 연동 (Link Guest Data)
// POST /api/auth/link
router.post('/link', async (req, res) => {
    const { guest_id, user_id } = req.body;

    if (!guest_id || !user_id) {
        return res.status(400).json({ error: 'guest_id와 user_id가 필요합니다.' });
    }

    try {
        // 1. 투두 데이터 이전
        await db.query(
            'UPDATE todos SET user_id = ? WHERE user_id = ?',
            [user_id, guest_id]
        );

        // 2. 일기 데이터 이전
        await db.query(
            'UPDATE diaries SET user_id = ? WHERE user_id = ?',
            [user_id, guest_id]
        );

        res.status(200).json({ message: '데이터 연동 성공' });
    } catch (error) {
        console.error('Link Error:', error);
        res.status(500).json({ error: '데이터 연동 중 오류 발생' });
    }
});

module.exports = router;
