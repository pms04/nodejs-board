# 🚀 Simple Node.js Bulletin Board (단순 Node.js 게시판)

Express, EJS, MySQL을 사용하여 구현한 기본적인 CRUD(생성, 읽기, 수정, 삭제), 검색, 페이지네이션 기능을 갖춘 웹 게시판 프로그램입니다.

## ✨ 주요 기능

* **게시물 목록 조회:** 페이지네이션 및 페이지 블록 적용 (10개씩, 5개 블록).
* **게시물 검색:** 제목으로 게시물 검색 기능 제공.
* **게시물 상세 보기:** 조회수 증가 기능 포함.
* **새 글 작성 (C):** 제목, 내용, 작성자 입력 및 이미지 파일 첨부 (Multer).
* **게시물 수정 (U):** 기존 내용 수정 및 이미지 교체 가능.
* **게시물 삭제 (D):** POST 요청을 통한 안전한 삭제.

## 🛠️ 환경 및 설치

### 1. 전제 조건

* **Node.js** (v14 이상 권장)
* **MySQL / MariaDB** 데이터베이스
* **Git**

### 2. 설치 단계

1.  **레포지토리 클론:**
    ```bash
    git clone [https://github.com/pms04/nodejs-board.git](https://github.com/pms04/nodejs-board.git)
    cd nodejs-board
    ```
2.  **패키지 설치:**
    ```bash
    npm install
    ```
3.  **데이터베이스 설정:**
    `src/config/db.js` 파일을 열어 MySQL 연결 정보를 설정합니다.
4.  **DB 스키마 적용:**
    MySQL 클라이언트에서 `schema.sql` 파일을 실행하여 `posts` 테이블을 생성하고 `image_url` 컬럼을 추가합니다.
5.  **서버 실행:**
    ```bash
    npm start
    ```

## 🔗 접속 정보

서버가 실행되면 다음 주소로 접속합니다.
* **URL:** `http://localhost:3000`