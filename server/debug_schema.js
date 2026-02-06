
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' }); // Load .env from current dir

async function debugSchema() {
    console.log("Connecting to DB...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log("\n--- TABLE: diaries ---");
        const [diariesCols] = await connection.query('DESCRIBE diaries');
        console.table(diariesCols);

        console.log("\n--- TABLE: todos ---");
        const [todosCols] = await connection.query('DESCRIBE todos');
        console.table(todosCols);

        console.log("\n--- TABLE: user_preferences ---");
        const [prefsCols] = await connection.query('DESCRIBE user_preferences');
        console.table(prefsCols);

    } catch (e) {
        console.error("Schema Debug Error:", e);
    } finally {
        await connection.end();
    }
}

debugSchema();
