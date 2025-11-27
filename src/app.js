// src/app.js
const express = require('express');
const path = require('path');
// 💡 세션 모듈 추가
const session = require('express-session'); 
// 💡 인증 라우터 추가
const authRouter = require('./routes/auth'); 
const boardRouter = require('./routes/board');

const app = express();
const port = 3000;

// EJS 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// POST 요청의 본문(body) 파싱 설정
app.use(express.urlencoded({ extended: true }));

// 💡 [추가] 세션 미들웨어 설정
app.use(session({
    secret: 'your_secret_key_for_session', // 세션 암호화 키
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1시간
}));

// 💡 [수정] 라우터 연결: '/'는 인증 담당, '/board'는 게시판 담당
app.use('/', authRouter);
app.use('/board', boardRouter); 

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});