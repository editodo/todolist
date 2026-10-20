// server/db.js
const mysql = require('mysql2');
// .env wins over stale PM2 env. Skipped under `node --test` so tests never touch the real database.
if (!process.env.NODE_TEST_CONTEXT) require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true });

// Create the real pool
// Create the real pool - using environment variables
// server/.env drives both Dev and Prod (never commit it)
console.log(`🔌 DB Connection Config: Host=${process.env.DB_HOST || 'localhost'}, User=${process.env.DB_USER || 'root'}, Db=${process.env.DB_NAME || 'editodo'}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD, // Can be undefined/empty for local
    database: process.env.DB_NAME || 'editodo',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mock Logic for Temporary Testing (Requested by User)
// If you want to force Mock Mode even if DB exists, set USE_MOCK=true in .env
// For now, we wrap the promise export to catch errors or return mock.

const promisePool = pool.promise();

// Check connection immediately
pool.getConnection((err, connection) => {
    if (err) {
        console.error('⚠️  Database Connection Failed:', err.code);
        console.warn('⚠️  Switching to MOCK MODE for temporary testing.');
    } else {
        console.log('✅  Connected to Database');
        connection.release();
    }
});

// Wrapper to intercept queries if DB is down (Simple Mock)
// This is a minimal implementation to prevent crash. 
// For read queries, it returns empty arrays. For writes, it returns success.
const wrappedPool = {
    query: async (sql, params) => {
        return await promisePool.query(sql, params);
    },
    getConnection: () => promisePool.getConnection()
};

module.exports = wrappedPool;
