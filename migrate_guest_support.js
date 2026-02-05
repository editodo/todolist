const db = require('./server/db');

async function migrate() {
    try {
        console.log('Starting migration...');

        // 1. Alter users table
        console.log('Altering users table...');
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS user_type ENUM('REGULAR', 'GUEST') DEFAULT 'REGULAR',
            MODIFY email VARCHAR(100) NULL,
            MODIFY password_hash VARCHAR(255) NULL
        `);

        // 2. Ensure user_preferences table is ready
        console.log('Ensuring user_preferences table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id INT PRIMARY KEY,
                mode ENUM('light', 'dark', 'system') DEFAULT 'system',
                theme VARCHAR(50),
                color_theme VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
