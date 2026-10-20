// server/cleanup_guests.js
// Deletes guest accounts (and their data) whose trial ended more than GUEST_RETENTION_DAYS ago.
// Run daily from cron on the server, e.g.:
//   0 4 * * * cd /var/www/editodo/server && node cleanup_guests.js >> /var/log/editodo-cleanup.log 2>&1
// Keep the retention period in sync with the privacy policy (PrivacyPolicyScreen).
const db = require('./db');
const { deleteUser } = require('./auth');

const RETENTION_DAYS = Number(process.env.GUEST_RETENTION_DAYS || 30);

(async () => {
    try {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE user_type = 'GUEST' AND expires_at < NOW() - INTERVAL ? DAY",
            [RETENTION_DAYS]
        );
        for (const { id } of rows) await deleteUser(id);
        console.log(`${new Date().toISOString()} deleted ${rows.length} expired guest account(s)`);
        process.exit(0);
    } catch (e) {
        console.error('Guest cleanup failed:', e);
        process.exit(1);
    }
})();
