
require('dotenv').config();
const mysql = require('mysql2');

console.log('Testing DB Access...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
// console.log('Password:', process.env.DB_PASSWORD); // Don't print password

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Connection Failed:', err.code);
        console.error(err);
        process.exit(1);
    }
    console.log('✅ Connection Successful!');

    connection.query('SELECT 1 + 1 AS solution', (error, results) => {
        connection.release();
        if (error) {
            console.error('❌ Query Failed:', error);
            process.exit(1);
        }
        console.log('✅ Query Result:', results[0].solution);
        process.exit(0);
    });
});
