
-- 권한 문제 해결을 위한 SQL 스크립트
CREATE DATABASE IF NOT EXISTS editodo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 127.0.0.1 (Local IP) 권한 추가
CREATE USER IF NOT EXISTS 'editodo'@'127.0.0.1' IDENTIFIED BY 'dbEdit0d0!@';
ALTER USER 'editodo'@'127.0.0.1' IDENTIFIED BY 'dbEdit0d0!@';
GRANT ALL PRIVILEGES ON editodo.* TO 'editodo'@'127.0.0.1';

-- localhost 권한 추가
CREATE USER IF NOT EXISTS 'editodo'@'localhost' IDENTIFIED BY 'dbEdit0d0!@';
ALTER USER 'editodo'@'localhost' IDENTIFIED BY 'dbEdit0d0!@';
GRANT ALL PRIVILEGES ON editodo.* TO 'editodo'@'localhost';

-- 외부 접속 (%) 권한 추가 (선택사항)
CREATE USER IF NOT EXISTS 'editodo'@'%' IDENTIFIED BY 'dbEdit0d0!@';
ALTER USER 'editodo'@'%' IDENTIFIED BY 'dbEdit0d0!@';
GRANT ALL PRIVILEGES ON editodo.* TO 'editodo'@'%';

FLUSH PRIVILEGES;
