
-- Update todos table to include target_date
ALTER TABLE todos ADD COLUMN target_date DATE DEFAULT (CURRENT_DATE);

-- Create diaries table
CREATE TABLE IF NOT EXISTS diaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    content TEXT,
    emotion VARCHAR(50),  -- e.g., 'happy', 'sad', 'neutral' or emoji itself on client
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_date (user_id, date) -- One diary per day per user
);
