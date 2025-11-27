const express = require('express');
const path = require('path');
const boardRouter = require('./routes/board');

const app = express();
const port = 3000;

// EJS 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// POST 요청의 본문(body) 파싱 설정
// 게시물 작성/수정 시 폼 데이터를 처리하기 위해 필요합니다.
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
// 모든 게시판 관련 요청은 boardRouter가 처리합니다.
app.use('/', boardRouter);

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});