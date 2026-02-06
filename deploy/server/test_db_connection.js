const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const promisePool = pool.promise();

async function testConnection() {
    try {
        console.log('Testing connection to:', process.env.DB_HOST);
        const [rows] = await promisePool.query('SELECT count(*) as count FROM users');
        console.log('User count:', rows[0].count);

        const [users] = await promisePool.query('SELECT * FROM users LIMIT 5');
        console.log('First 5 users:', users);

        process.exit(0);
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    }
}

testConnection();
