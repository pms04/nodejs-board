-- 데이터베이스 및 테이블 생성 (필요에 따라 주석 해제하여 사용)
-- CREATE DATABASE IF NOT EXISTS board_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE board_db;

-- posts 테이블 생성 (게시판 핵심 테이블)
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 이미지 업로드 기능 추가를 위한 컬럼 변경 (image_url 컬럼 추가)
-- 이미 테이블이 존재하고 컬럼이 없는 경우에만 실행합니다.
ALTER TABLE posts ADD COLUMN image_url VARCHAR(255) NULL;

-- 예시 데이터 삽입 (선택 사항)
INSERT INTO posts (title, content, author) VALUES 
('첫 번째 게시글', '안녕하세요! 게시판을 시작합니다.', '관리자'),
('Node.js Express 게시판 테스트', '페이지네이션과 검색 기능 확인 중입니다.', '개발자');