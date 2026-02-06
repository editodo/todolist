require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setup() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'editodo',
            multipleStatements: true
        });

        console.log('✅ Connected to database.');

        const sqlPath = path.join(__dirname, 'create_notices_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await connection.query(sql);
        console.log('✅ Notices table created successfully.');

        await connection.end();
    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
}

setup();
