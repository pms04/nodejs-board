-- 1. 데이터베이스 생성 및 선택
-- 사용자 요청에 따라 db데이터베이스 이름을 'pmsboard'로 설정합니다.
CREATE DATABASE IF NOT EXISTS pmsboard;
USE pmsboard;

-- 2. posts 테이블 생성
-- 게시물 목록, 본문, 조회수, 작성/수정 기능을 위한 최소한의 컬럼만 정의합니다.
CREATE TABLE IF NOT EXISTS posts (
    -- 게시물 고유 ID (기본 키)
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    -- 게시물 제목 (최대 255자)
    title VARCHAR(255) NOT NULL,
    
    -- 게시물 내용 (긴 텍스트)
    content TEXT NOT NULL,
    
    -- 작성자 (간단하게 문자열로 처리)
    author VARCHAR(100) NOT NULL,
    
    -- 조회수 (기본값은 0)
    views INT UNSIGNED DEFAULT 0,
    
    -- 작성일 (게시물 생성 시각 기록)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- 수정일 (게시물 수정 시각 기록)
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

drop table users;
drop table posts;


-- 3. 테스트 데이터 삽입 (선택 사항)
INSERT INTO posts (title, content, author) VALUES 
('환영합니다', '단순하고 깔끔한 게시판입니다.', 'Admin'),
('Node.js 게시판 만들기', 'Express와 MySQL을 활용합니다.', 'Developer');