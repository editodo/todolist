-- EdiTodo MVP 서비스 데이터베이스 스키마
-- Oracle Cloud ATP용

-- 사용자 테이블
CREATE TABLE users (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    nickname VARCHAR2(50),
    profile_image VARCHAR2(255),
    theme_preference VARCHAR2(50) DEFAULT 'style_simple',
    color_preference VARCHAR2(50) DEFAULT 'palette_simple',
    font_preference VARCHAR2(50) DEFAULT 'font_default',
    mode_preference VARCHAR2(20) DEFAULT 'lightmode',
    is_admin NUMBER(1) DEFAULT 0,
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SNS 로그인 연동 테이블
CREATE TABLE user_sns (
    sns_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    provider VARCHAR2(20) NOT NULL, -- 'google', 'kakao', 'naver'
    provider_user_id VARCHAR2(100) NOT NULL,
    access_token VARCHAR2(500),
    refresh_token VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- 투두리스트 테이블
CREATE TABLE todos (
    todo_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    title VARCHAR2(500) NOT NULL,
    description CLOB,
    is_completed NUMBER(1) DEFAULT 0,
    priority NUMBER(1) DEFAULT 1, -- 1: 낮음, 2: 보통, 3: 높음
    due_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 일기 테이블
CREATE TABLE diaries (
    diary_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    diary_date DATE NOT NULL,
    content CLOB,
    mood_emoji VARCHAR2(10),
    weather VARCHAR2(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, diary_date)
);

-- 사용자 설정 테이블
CREATE TABLE user_settings (
    setting_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    setting_key VARCHAR2(50) NOT NULL,
    setting_value VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);

-- 공지사항 테이블
CREATE TABLE notices (
    notice_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    title VARCHAR2(200) NOT NULL,
    content CLOB NOT NULL,
    is_notice NUMBER(1) DEFAULT 0 NOT NULL, -- 0: 일반게시글, 1: 공지사항
    view_count NUMBER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_notices_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 첨부파일 테이블
CREATE TABLE notice_attachments (
    attachment_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    notice_id NUMBER NOT NULL,
    original_filename VARCHAR2(255) NOT NULL,
    stored_filename VARCHAR2(255) NOT NULL,
    file_path VARCHAR2(500) NOT NULL,
    file_size NUMBER NOT NULL,
    mime_type VARCHAR2(100) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_attachments_notice FOREIGN KEY (notice_id) REFERENCES notices(notice_id) ON DELETE CASCADE
);

-- 게시글 작성 권한 테이블
CREATE TABLE notice_permissions (
    permission_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    granted_by NUMBER NOT NULL,
    granted_at TIMESTAMP DEFAULT SYSDATE NOT NULL,
    CONSTRAINT fk_permissions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_permissions_granted_by FOREIGN KEY (granted_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 문의사항 테이블
CREATE TABLE inquiries (
    inquiry_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    title VARCHAR2(200) NOT NULL,
    content CLOB,
    inquiry_type VARCHAR2(50), -- 'bug', 'feature', 'general'
    status VARCHAR2(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    admin_response CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_todos_user_date ON todos(user_id, due_date);
CREATE INDEX idx_todos_completed ON todos(user_id, is_completed);
CREATE INDEX idx_diaries_user_date ON diaries(user_id, diary_date);
CREATE INDEX idx_user_sns_provider ON user_sns(provider, provider_user_id);
CREATE INDEX idx_notices_user_id ON notices(user_id);
CREATE INDEX idx_notices_is_notice ON notices(is_notice);
CREATE INDEX idx_notices_created_at ON notices(created_at);
CREATE INDEX idx_attachments_notice_id ON notice_attachments(notice_id);
CREATE INDEX idx_permissions_user_id ON notice_permissions(user_id);

-- 시퀀스 생성 (IDENTITY 대신 사용할 경우)
-- CREATE SEQUENCE seq_users START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE seq_todos START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE seq_diaries START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE notice_id_seq START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE attachment_id_seq START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE permission_id_seq START WITH 1 INCREMENT BY 1;

-- 관리자 계정 생성 (비밀번호: admin123!)
INSERT INTO users (username, email, password_hash, nickname, is_admin) 
VALUES ('admin', 'admin@editodo.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '관리자', 1);

-- 샘플 공지사항
INSERT INTO notices (user_id, title, content, is_notice) 
VALUES (1, 'EdiTodo 서비스 오픈', 'EdiTodo 서비스가 정식 오픈되었습니다. 많은 관심 부탁드립니다!', 1);

-- 이메일 인증 테이블
CREATE TABLE email_verifications (
    verification_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    email VARCHAR2(100) NOT NULL,
    verification_code VARCHAR2(10) NOT NULL,
    is_verified NUMBER(1) DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 회원탈퇴 사유 테이블
CREATE TABLE user_deletions (
    deletion_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    reason VARCHAR2(100) NOT NULL,
    additional_comment CLOB,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Fonts 설정 테이블
CREATE TABLE user_fonts (
    font_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    font_family VARCHAR2(100) NOT NULL,
    font_url VARCHAR2(500),
    is_custom NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 캘린더 이벤트 테이블
CREATE TABLE calendar_events (
    event_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    title VARCHAR2(200) NOT NULL,
    description CLOB,
    event_date DATE NOT NULL,
    start_time VARCHAR2(5), -- HH:MM 형식
    end_time VARCHAR2(5),   -- HH:MM 형식
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id);
CREATE INDEX idx_email_verifications_code ON email_verifications(verification_code);
CREATE INDEX idx_user_fonts_user ON user_fonts(user_id);
CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);

-- 관리자 계정에 게시글 작성 권한 부여
INSERT INTO notice_permissions (user_id, granted_by) 
SELECT user_id, user_id FROM users WHERE username = 'admin';

COMMIT;
