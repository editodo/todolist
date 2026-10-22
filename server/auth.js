// server/auth.js
const jwt = require('jsonwebtoken');
const db = require('./db');
const { revokeAppleToken, unlinkKakao } = require('./social');

// shortcut: long-lived token with no refresh/revocation (deleting the user revokes it); add refresh tokens if sessions need to be shorter
const TOKEN_TTL = '90d';

function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

// Sets req.userId from the Bearer token. Client-sent user ids are never trusted.
async function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: '로그인이 필요합니다.' });

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ error: '로그인이 만료되었습니다. 다시 로그인해주세요.' });
    }

    try {
        const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [payload.userId]);
        if (rows.length === 0) return res.status(401).json({ error: '존재하지 않는 계정입니다.' });
    } catch (e) {
        console.error('Auth Check Error:', e);
        return res.status(500).json({ error: 'Server Error' });
    }

    req.userId = payload.userId;
    next();
}

// Optional auth: the user id from a valid Bearer token, or null. For routes that also work logged out.
function userIdFromHeader(req) {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return null;
    try {
        return jwt.verify(header.slice(7), process.env.JWT_SECRET).userId;
    } catch (e) {
        return null;
    }
}

// Removes a user and everything they own. Used by self-withdrawal, admin delete and guest cleanup.
async function deleteUser(userId) {
    // Apple requires revoking Sign in with Apple tokens on account deletion; a failure here must not block deletion
    try {
        const [apple] = await db.query("SELECT apple_refresh_token, apple_client_id FROM social_accounts WHERE user_id = ? AND provider = 'apple'", [userId]);
        for (const row of apple) await revokeAppleToken(row.apple_refresh_token, row.apple_client_id);
    } catch (e) {
        console.error('Apple revoke failed:', e.message);
    }
    try {
        const [kakao] = await db.query("SELECT provider_user_id FROM social_accounts WHERE user_id = ? AND provider = 'kakao'", [userId]);
        for (const row of kakao) await unlinkKakao(row.provider_user_id);
    } catch (e) {
        console.error('Kakao unlink failed:', e.message);
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('DELETE FROM todos WHERE user_id = ?', [userId]);
        await conn.query('DELETE FROM todo_repeats WHERE user_id = ?', [userId]);
        await conn.query('DELETE FROM diaries WHERE user_id = ?', [userId]);
        await conn.query('DELETE FROM user_preferences WHERE user_id = ?', [userId]);
        await conn.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);
        await conn.query('DELETE FROM social_accounts WHERE user_id = ?', [userId]);
        await conn.query('DELETE FROM users WHERE id = ?', [userId]);
        await conn.commit();
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}

// Logging in from a not-signed-in (guest) session: move the guest's to-dos and daily records into the
// account, then remove the guest. Same-day records are joined (account's text first, its sticker kept).
async function mergeGuestInto(guestId, targetId) {
    if (!guestId || guestId === targetId) return;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('UPDATE todos SET user_id = ? WHERE user_id = ?', [targetId, guestId]);
        await conn.query('UPDATE todo_repeats SET user_id = ? WHERE user_id = ?', [targetId, guestId]);
        await conn.query(
            "UPDATE diaries t JOIN diaries g ON g.date = t.date AND g.user_id = ? SET t.content = CONCAT(t.content, '\n\n', g.content) WHERE t.user_id = ?",
            [guestId, targetId]
        );
        await conn.query('DELETE g FROM diaries g JOIN diaries t ON t.date = g.date AND t.user_id = ? WHERE g.user_id = ?', [targetId, guestId]);
        await conn.query('UPDATE diaries SET user_id = ? WHERE user_id = ?', [targetId, guestId]);
        // An account that never saved settings takes the theme/font/language chosen before logging in
        const [targetPrefs] = await conn.query('SELECT user_id FROM user_preferences WHERE user_id = ?', [targetId]);
        if (targetPrefs.length === 0) await conn.query('UPDATE user_preferences SET user_id = ? WHERE user_id = ?', [targetId, guestId]);
        await conn.commit();
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
    await deleteUser(guestId);
}

// The guest behind this request's token, if the caller is one (null otherwise)
async function callerGuestId(req) {
    const id = userIdFromHeader(req);
    if (!id) return null;
    const [rows] = await db.query("SELECT id FROM users WHERE id = ? AND user_type = 'GUEST'", [id]);
    return rows.length ? id : null;
}

module.exports = { signToken, requireAuth, userIdFromHeader, deleteUser, mergeGuestInto, callerGuestId };
