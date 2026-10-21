// server/cleanup_guests.js
// Deletes not-signed-in (guest) accounts, and their data, unused for GUEST_RETENTION_DAYS (default 1 year).
// The server runs it once a day (index.js); it can also be run by hand: node cleanup_guests.js
// Keep the retention period in sync with the privacy policy (PrivacyPolicyScreen).
const db = require('./db');
const { deleteUser } = require('./auth');

const RETENTION_DAYS = Number(process.env.GUEST_RETENTION_DAYS || 365);

async function cleanupGuests() {
    const [rows] = await db.query(
        "SELECT id FROM users WHERE user_type = 'GUEST' AND COALESCE(last_active_at, created_at) < NOW() - INTERVAL ? DAY",
        [RETENTION_DAYS]
    );
    for (const { id } of rows) await deleteUser(id);
    console.log(`${new Date().toISOString()} deleted ${rows.length} unused guest account(s)`);
}

module.exports = { cleanupGuests };

if (require.main === module) {
    cleanupGuests().then(() => process.exit(0)).catch((e) => {
        console.error('Guest cleanup failed:', e);
        process.exit(1);
    });
}
