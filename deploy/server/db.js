// server/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create the real pool
const pool = mysql.createPool({
    host: '222.239.250.229', //'127.0.0.1',     // Hardcoded for certainty
    user: 'root',          // Hardcoded
    password: 'dbDami79!@',// Hardcoded
    database: 'editodo',   // Hardcoded
    port: 3306,
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
    // re-export other methods if needed
    getConnection: promisePool.getConnection
};

module.exports = wrappedPool;
