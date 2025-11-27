const express = require('express');
const path = require('path');
const boardRouter = require('./routes/board');

const app = express();
const port = 3000;

// [수정] 정적 파일 (CSS)을 제공하기 위한 미들웨어 추가
app.use(express.static(path.join(__dirname, 'public'))); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', boardRouter);

app.use((req, res, next) => {
    res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});