-- Database 생성
CREATE DATABASE IF NOT EXISTS editodo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User 생성 (비밀번호: dbEdit0d0!@)
CREATE USER IF NOT EXISTS 'editodo'@'%' IDENTIFIED BY 'dbEdit0d0!@';

-- 권한 부여
GRANT ALL PRIVILEGES ON editodo.* TO 'editodo'@'%';

-- 적용
FLUSH PRIVILEGES;

-- 테이블 생성 (예시 - 실제 테이블 구조는 프로젝트에 맞게 추가 필요)
USE editodo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  text TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
