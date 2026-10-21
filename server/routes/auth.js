const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // Password hashing (Install needed: npm install bcrypt)
const crypto = require('crypto');
const { signToken, requireAuth, userIdFromHeader, deleteUser, mergeGuestInto, callerGuestId } = require('../auth');
const { verifySocialToken, appleRefreshToken } = require('../social');
const { isMailConfigured, sendMail } = require('../mail');

const USERNAME_RE = /^[a-zA-Z0-9_]{4,20}$/;
const MIN_PASSWORD = 8;

// The user object the app keeps after login (login, refresh and social sign-in all return this shape)
async function userPayload(user) {
    const [prefs] = await db.query('SELECT * FROM user_preferences WHERE user_id = ?', [user.id]);
    const userPrefs = prefs[0] || {};
    const [social] = await db.query('SELECT provider FROM social_accounts WHERE user_id = ?', [user.id]);
    return {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        user_type: user.user_type,
        profile_image: user.profile_image,
        expires_at: user.expires_at,
        mode: userPrefs.mode,
        theme: userPrefs.theme,
        color_theme: userPrefs.color_theme,
        providers: social.map((s) => s.provider), // SNS accounts this user signs in with
    };
}

// Returns an error message, or null when the new account fields are acceptable
function validateAccount(username, password) {
    if (!USERNAME_RE.test(username)) return '아이디는 영문, 숫자, _ 조합 4~20자로 입력해주세요.';
    if (username.startsWith('guest_')) return '사용할 수 없는 아이디입니다.';
    if (typeof password !== 'string' || password.length < MIN_PASSWORD) return `비밀번호는 ${MIN_PASSWORD}자 이상 입력해주세요.`;
    return null;
}

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
        const guestUsername = `guest_${crypto.randomBytes(8).toString('hex')}`; // unguessable: guests have no password
        const randomNickname = generateRandomNickname();

        // No expiry: a not-signed-in account lives until 1 year without opening the app (cleanup_guests.js)
        const [result] = await db.query(
            'INSERT INTO users (username, nickname, user_type, last_active_at) VALUES (?, ?, ?, NOW())',
            [guestUsername, randomNickname, 'GUEST']
        );

        const newUserId = result.insertId;

        res.status(201).json({
            message: '게스트 로그인 성공',
            user: {
                id: newUserId,
                username: guestUsername,
                nickname: randomNickname,
                user_type: 'GUEST',
                expires_at: null
            },
            token: signToken(newUserId),
            isNew: true // 체험 단계(STEP01)로 이동 트리거
        });
    } catch (error) {
        console.error('Guest Login Error:', error);
        res.status(500).json({ error: '게스트 계정 생성 중 오류 발생' });
    }
});

// ✅ 계정 전환 (Convert Guest to Regular)
// POST /api/auth/convert
router.post('/convert', requireAuth, async (req, res) => {
    const { username, password, nickname, email, phone_number } = req.body;
    const user_id = req.userId; // only the logged-in guest can convert itself

    if (!username || !password) {
        return res.status(400).json({ error: '필수 정보를 모두 입력해주세요.' });
    }
    const invalid = validateAccount(username, password);
    if (invalid) return res.status(400).json({ error: invalid });

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
        if (email) {
            const [emailTaken] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, user_id]);
            if (emailTaken.length > 0) return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
        }

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
router.put('/user/:id', requireAuth, async (req, res) => {
    const userId = req.userId;
    if (Number(req.params.id) !== userId) return res.status(403).json({ error: '권한이 없습니다.' });
    const nickname = typeof req.body.nickname === 'string' ? req.body.nickname.trim() : '';
    const { profile_image } = req.body;
    if (!nickname || nickname.length > 20) return res.status(400).json({ error: '닉네임은 1~20자로 입력해주세요.' });
    if (profile_image != null && (typeof profile_image !== 'string' || profile_image.length > 255)) {
        return res.status(400).json({ error: '프로필 이미지 주소가 올바르지 않습니다.' });
    }

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
        const invalid = validateAccount(username, password);
        if (invalid) return res.status(400).json({ error: invalid });
        if (nickname !== undefined && (typeof nickname !== 'string' || nickname.trim().length > 20)) {
            return res.status(400).json({ error: '닉네임은 20자까지 입력할 수 있습니다.' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) return res.status(409).json({ error: '이미 존재하는 아이디 혹은 이메일입니다.' });

        const hash = await bcrypt.hash(password, 10);
        const finalNickname = (typeof nickname === 'string' && nickname.trim()) || generateRandomNickname(); // Default nickname if none

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
        const LOGIN_FAILED = '아이디 또는 비밀번호가 일치하지 않습니다.';
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ error: LOGIN_FAILED });

        const user = users[0];

        // Guests have no password and are reachable only through their token
        if (user.user_type !== 'REGULAR' || !user.password_hash) {
            return res.status(401).json({ error: LOGIN_FAILED });
        }

        const match = await bcrypt.compare(password || '', user.password_hash);
        if (!match) {
            return res.status(401).json({ error: LOGIN_FAILED });
        }
        await mergeGuestInto(await callerGuestId(req), user.id);

        res.status(200).json({
            message: '로그인 성공',
            token: signToken(user.id),
            user: await userPayload(user)
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: '로그인 중 오류 발생' });
    }
});

// ✅ 로그인 유지 (Session refresh)
// POST /api/auth/refresh — the app calls this on every start: a valid token is swapped for a fresh 90-day one
router.post('/refresh', requireAuth, async (req, res) => {
    try {
        await db.query('UPDATE users SET last_active_at = NOW() WHERE id = ?', [req.userId]);
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);
        res.status(200).json({ token: signToken(req.userId), user: await userPayload(users[0]) });
    } catch (error) {
        console.error('Refresh Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Kakao redirects the browser here after login. Pass the one-time code back unchanged: to the app's scheme
// (state ends in ".app"), or to the web popup's opener on our own origin. The code alone is useless without
// the PKCE verifier the app kept, and only POST /social/kakao (with our secret) can redeem it.
router.get('/kakao/callback', (req, res) => {
    const q = (k) => (typeof req.query[k] === 'string' ? req.query[k] : '');
    const result = { code: q('code'), state: q('state'), error: q('error') };
    if (result.state.endsWith('.app')) return res.redirect(`editodo://auth/kakao?${new URLSearchParams(result)}`);
    const origin = process.env.KAKAO_WEB_ORIGIN || 'https://editodo.com';
    const data = JSON.stringify({ type: 'kakao', ...result }).replace(/</g, '\\u003c');
    res.type('html').send(`<!doctype html><meta charset="utf-8"><script>if (window.opener) window.opener.postMessage(${data}, ${JSON.stringify(origin)}); window.close();</script>`);
});

// ✅ SNS 로그인 (Sign in with Apple / Google / Kakao)
// POST /api/auth/social/:provider  apple: { identityToken, authorizationCode, fullName }  google: { idToken }  kakao: { code, codeVerifier }
// Order: existing link → guest becomes the account → same verified email links → new account.
// A guest's records always come along: merged into an existing account, or kept when the guest itself converts.
router.post('/social/:provider', async (req, res) => {
    const { provider } = req.params;
    if (!['apple', 'google', 'kakao'].includes(provider)) return res.status(404).json({ error: '지원하지 않는 로그인 방식입니다.' });

    let profile;
    try {
        profile = await verifySocialToken(provider, req.body);
    } catch (e) {
        console.error(`Social verify (${provider}) failed:`, e.message);
        return res.status(401).json({ error: '로그인 정보를 확인하지 못했습니다. 다시 시도해주세요.' });
    }

    try {
        let isNew = false;
        let userId;
        const [linked] = await db.query('SELECT user_id FROM social_accounts WHERE provider = ? AND provider_user_id = ?', [provider, profile.sub]);

        const guestId = await callerGuestId(req);
        if (linked.length > 0) {
            userId = linked[0].user_id;
            await mergeGuestInto(guestId, userId);
        } else {
            const guest = guestId ? [{ id: guestId }] : [];
            const [sameEmail] = profile.email && profile.emailVerified
                ? await db.query("SELECT id FROM users WHERE email = ? AND user_type = 'REGULAR'", [profile.email])
                : [[]];

            if (guest.length > 0) {
                userId = guest[0].id;
                const [emailTaken] = profile.email ? await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [profile.email, userId]) : [[]];
                await db.query(
                    "UPDATE users SET user_type = 'REGULAR', expires_at = NULL, username = ?, email = ?, nickname = COALESCE(?, nickname) WHERE id = ?",
                    [`${provider}_${crypto.randomBytes(8).toString('hex')}`, emailTaken.length ? null : profile.email, profile.name, userId]
                );
            } else if (sameEmail.length > 0) {
                userId = sameEmail[0].id;
                await mergeGuestInto(guestId, userId);
            } else {
                const [emailTaken] = profile.email ? await db.query('SELECT id FROM users WHERE email = ?', [profile.email]) : [[]];
                const [result] = await db.query(
                    "INSERT INTO users (username, nickname, email, user_type) VALUES (?, ?, ?, 'REGULAR')",
                    [`${provider}_${crypto.randomBytes(8).toString('hex')}`, profile.name || generateRandomNickname(), emailTaken.length ? null : profile.email]
                );
                userId = result.insertId;
                isNew = true;
            }

            await db.query('INSERT INTO social_accounts (provider, provider_user_id, user_id) VALUES (?, ?, ?)', [provider, profile.sub, userId]);
        }

        if (provider === 'apple' && req.body.authorizationCode) {
            try {
                const refreshToken = await appleRefreshToken(req.body.authorizationCode, profile.clientId);
                if (refreshToken) {
                    await db.query("UPDATE social_accounts SET apple_refresh_token = ?, apple_client_id = ? WHERE provider = 'apple' AND provider_user_id = ?", [refreshToken, profile.clientId, profile.sub]);
                }
            } catch (e) {
                console.error('Apple token exchange failed:', e.message); // login still succeeds; only revocation is affected
            }
        }

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        res.status(200).json({ token: signToken(userId), user: await userPayload(users[0]), isNew });
    } catch (error) {
        console.error('Social Login Error:', error);
        res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
});

// ✅ 아이디 찾기 + 비밀번호 재설정 (Password reset by emailed 6-digit code)
const RESET_TTL_MIN = 15;
const RESET_MAX_ATTEMPTS = 5;
const hashCode = (code) => crypto.createHmac('sha256', process.env.JWT_SECRET).update(code).digest('hex');

// POST /api/auth/password-reset/request { email }
// Same response whether or not the email exists, so it can't be used to discover accounts.
router.post('/password-reset/request', async (req, res) => {
    const { email } = req.body;
    const SENT = { message: '가입된 이메일이라면 인증 코드를 보냈습니다. 메일함을 확인해주세요.' };
    if (typeof email !== 'string' || !email.includes('@')) return res.status(400).json({ error: '이메일을 정확히 입력해주세요.' });
    if (!isMailConfigured()) return res.status(503).json({ error: '메일 발송이 준비되지 않았습니다. 문의하기로 연락해주세요.' });

    try {
        const [users] = await db.query("SELECT id, username FROM users WHERE email = ? AND user_type = 'REGULAR'", [email]);
        if (users.length === 0) return res.status(200).json(SENT);

        const user = users[0];
        const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
        await db.query(
            `REPLACE INTO password_resets (user_id, code_hash, expires_at, attempts)
             VALUES (?, ?, NOW() + INTERVAL ? MINUTE, 0)`,
            [user.id, hashCode(code), RESET_TTL_MIN]
        );
        await sendMail({
            to: email,
            subject: '[EdiTodo] 비밀번호 재설정 인증 코드',
            text: `안녕하세요, EdiTodo입니다.

아이디: ${user.username}
인증 코드: ${code}

앱의 비밀번호 재설정 화면에 위 코드를 입력해주세요. 코드는 ${RESET_TTL_MIN}분 동안 유효합니다.
본인이 요청하지 않았다면 이 메일은 무시하셔도 됩니다.`,
        });
        res.status(200).json(SENT);
    } catch (error) {
        console.error('Password Reset Request Error:', error);
        res.status(500).json({ error: '메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
});

// POST /api/auth/password-reset/confirm { email, code, password }
router.post('/password-reset/confirm', async (req, res) => {
    const { email, code, password } = req.body;
    const INVALID = { error: '인증 코드가 올바르지 않거나 만료되었습니다.' };
    if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
        return res.status(400).json({ error: `비밀번호는 ${MIN_PASSWORD}자 이상 입력해주세요.` });
    }
    if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return res.status(400).json(INVALID);

    try {
        const [rows] = await db.query(
            `SELECT r.user_id, r.code_hash, r.attempts, r.expires_at > NOW() AS valid
             FROM password_resets r JOIN users u ON u.id = r.user_id
             WHERE u.email = ? AND u.user_type = 'REGULAR'`,
            [email]
        );
        const reset = rows[0];
        if (!reset || !reset.valid || reset.attempts >= RESET_MAX_ATTEMPTS) return res.status(400).json(INVALID);

        const given = Buffer.from(hashCode(code));
        if (!crypto.timingSafeEqual(given, Buffer.from(reset.code_hash))) {
            await db.query('UPDATE password_resets SET attempts = attempts + 1 WHERE user_id = ?', [reset.user_id]);
            return res.status(400).json(INVALID);
        }

        const hash = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, reset.user_id]);
        await db.query('DELETE FROM password_resets WHERE user_id = ?', [reset.user_id]);
        res.status(200).json({ message: '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.' });
    } catch (error) {
        console.error('Password Reset Confirm Error:', error);
        res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
    }
});

// ✅ 회원 탈퇴 (Delete own account and all its data)
// DELETE /api/auth/me
router.delete('/me', requireAuth, async (req, res) => {
    try {
        await deleteUser(req.userId);
        res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ error: '회원 탈퇴 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
