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

async function migrate() {
    try {
        console.log('🚀 Starting Migration...');

        // 1. Add expires_at to users
        try {
            await promisePool.query("ALTER TABLE users ADD COLUMN expires_at DATETIME DEFAULT NULL");
            console.log("✅ Added 'expires_at' column to users");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ 'expires_at' already exists");
            else console.error("❌ Failed to add 'expires_at':", e.message);
        }

        // 2. Add profile_image to users
        try {
            await promisePool.query("ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL");
            console.log("✅ Added 'profile_image' column to users");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ 'profile_image' already exists");
            else console.error("❌ Failed to add 'profile_image':", e.message);
        }

        // 3. Ensure user_preferences table exists
        const createPrefsTable = `
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id INT PRIMARY KEY,
                mode VARCHAR(50) DEFAULT 'light',
                theme VARCHAR(50) DEFAULT 'basic',
                color_theme VARCHAR(50) DEFAULT 'simple',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await promisePool.query(createPrefsTable);
        console.log("✅ Verified 'user_preferences' table");

        console.log('✨ Migration Complete');
        process.exit(0);
    } catch (e) {
        console.error('Migration Fatal Error:', e);
        process.exit(1);
    }
}

migrate();
