CREATE DATABASE IF NOT EXISTS edito_db;
USE edito_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE, -- userId from join.html
    email VARCHAR(100) NOT NULL UNIQUE,   -- userEmail from join.html
    password_hash VARCHAR(255) NOT NULL,  -- userPw (hashed)
    phone_number VARCHAR(20),             -- userCall
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. User Preferences (from step01.html/onboarding)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INT PRIMARY KEY,
    mode ENUM('light', 'dark', 'system') DEFAULT 'system',
    theme VARCHAR(50),
    color_theme VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Todos (from todolist.html)
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    target_date DATE, -- For calendar integration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Daily Diary/Journal (from calendar.html - emoji faces)
CREATE TABLE IF NOT EXISTS daily_diaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    emoji_index INT, -- 0-5 based on emoji_face${i}.svg
    content TEXT,    -- Optional text content for the diary
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_puser_date (user_id, entry_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
