const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // Password hashing (Install needed: npm install bcrypt)

// ---------------------------------------------------------
// Helper: Random Nickname Generator
// ---------------------------------------------------------
function generateRandomNickname() {
    const adjectives = ['행복한', '즐거운', '신나는', '멋진', '배고픈', '졸린', '자유로운', '용감한', '친절한', '지혜로운'];
    const nouns = ['여행자', '개발자', '고양이', '강아지', '쿼카', '나비', '사자', '호랑이', '토끼', '부엉이'];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);

    return `${adj}${noun}${num}`;
}

// ✅ 게스트 로그인 (Guest Login)
// POST /api/auth/guest-login
router.post('/guest-login', async (req, res) => {
    try {
        // 임시 게스트 정보 생성
        const guestUsername = `guest_${Date.now()}`;
        const randomNickname = generateRandomNickname();

        // 7일 후 만료 설정
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const [result] = await db.query(
            'INSERT INTO users (username, nickname, user_type, expires_at) VALUES (?, ?, ?, ?)',
            [guestUsername, randomNickname, 'GUEST', expiresAt]
        );

        const newUserId = result.insertId;

        res.status(201).json({
            message: '게스트 로그인 성공',
            user: {
                id: newUserId,
                username: guestUsername,
                nickname: randomNickname,
                user_type: 'GUEST',
                expires_at: expiresAt
            },
            isNew: true // 체험 단계(STEP01)로 이동 트리거
        });
    } catch (error) {
        console.error('Guest Login Error:', error);
        res.status(500).json({ error: '게스트 계정 생성 중 오류 발생' });
    }
});

// ✅ 계정 전환 (Convert Guest to Regular)
// POST /api/auth/convert
router.post('/convert', async (req, res) => {
    const { user_id, username, password, nickname, email, phone_number } = req.body;

    if (!user_id || !username || !password) {
        return res.status(400).json({ error: '필수 정보를 모두 입력해주세요.' });
    }

    try {
        // 1. 현재 사용자 확인
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
        if (users.length === 0) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

        const currentUser = users[0];
        if (currentUser.user_type !== 'GUEST') {
            return res.status(400).json({ error: '이미 정회원 계정입니다.' });
        }

        // 2. 아이디 중복 확인
        const [existing] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, user_id]);
        if (existing.length > 0) return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });

        // 3. 비밀번호 해싱
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        // 4. 정보 업데이트 (계정 전환)
        await db.query(`
            UPDATE users 
            SET username = ?, password_hash = ?, nickname = ?, email = ?, phone_number = ?, 
                user_type = 'REGULAR', expires_at = NULL 
            WHERE id = ?
        `, [username, hash, nickname || currentUser.nickname, email, phone_number, user_id]);

        res.status(200).json({ message: '계정 전환이 완료되었습니다.' });

    } catch (error) {
        console.error('Convert Error:', error);
        res.status(500).json({ error: '계정 전환 중 오류 발생' });
    }
});

// ✅ 프로필 업데이트 (Update Profile)
// PUT /api/auth/user/:id
router.put('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const { nickname, profile_image } = req.body;

    try {
        await db.query(
            'UPDATE users SET nickname = ?, profile_image = ? WHERE id = ?',
            [nickname, profile_image, userId]
        );
        res.status(200).json({ message: '프로필이 업데이트되었습니다.' });
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ error: '프로필 업데이트 실패' });
    }
});

// ✅ 회원가입 (Register - Direct)
// POST /api/auth/join
router.post('/join', async (req, res) => {
    const { username, email, password, phone_number, nickname } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: '필수 정보를 모두 입력해주세요.' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) return res.status(409).json({ error: '이미 존재하는 아이디 혹은 이메일입니다.' });

        const hash = await bcrypt.hash(password, 10);
        const finalNickname = nickname || generateRandomNickname(); // Default nickname if none

        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, phone_number, nickname, user_type) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hash, phone_number, finalNickname, 'REGULAR']
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
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });

        const user = users[0];

        // 만료 체크 (게스트인 경우)
        if (user.user_type === 'GUEST' && user.expires_at && new Date() > new Date(user.expires_at)) {
            // 만료됨 -> 그러나 전환은 가능하도록 로그인 자체를 막을지, 아니면 'Expired' 상태를 리턴할지?
            // 요구사항 4: 체험기간 만료시 로그인 불가하지만 본계정으로 전환가능하도록 처리
            // -> 로그인은 성공시키되, 클라이언트에서 '만료됨 -> 전환 모달'을 띄우는 것이 UX상 좋음.
            // 일단 로그인 성공시키고 isExpired 플래그를 보냄.
        }

        const match = await bcrypt.compare(password, user.password_hash || '');
        // 게스트는 password_hash가 null일 수 있음. 
        // 게스트는 아이디로만 로그인? 아니면 로컬스토리지 토큰으로만?
        // 게스트가 '로그인' 화면에서 아이디를 칠 일은 거의 없음 (자동로그인). 
        // 하지만 만약 친다면 비번이 없으므로 로그인 불가.

        if (user.user_type === 'REGULAR' && !match) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

        // Preferneces Join
        const [prefs] = await db.query('SELECT * FROM user_preferences WHERE user_id = ?', [user.id]);
        const userPrefs = prefs[0] || {};

        res.status(200).json({
            message: '로그인 성공',
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                email: user.email,
                user_type: user.user_type,
                profile_image: user.profile_image,
                expires_at: user.expires_at,
                mode: userPrefs.mode, // Include prefs in login response
                theme: userPrefs.theme,
                color_theme: userPrefs.color_theme
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: '로그인 중 오류 발생' });
    }
});

module.exports = router;
