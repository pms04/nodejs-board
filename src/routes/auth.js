// src/routes/auth.js (새로 생성)
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const bcrypt = require('bcryptjs'); // 비밀번호 해시를 위한 라이브러리 (npm install bcryptjs 필요)

// 1. 메인 경로: 로그인 여부에 따라 로그인 화면 또는 게시판으로 리다이렉트
router.get('/', (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/board'); 
    }
    // 로그인 안 되어 있으면 로그인 뷰 표시
    res.render('login', { error: null });
});

// 2. 로그인 및 회원가입 화면
router.get('/login', (req, res) => { res.render('login', { error: null }); });
router.get('/signup', (req, res) => { res.render('signup', { error: null }); });

// 3. 로그인 처리
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.render('login', { error: '유효하지 않은 이메일 또는 비밀번호입니다.' });
        }
        const user = results[0];
        // 비밀번호 일치 확인
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // 세션에 로그인 상태 저장
            req.session.isLoggedIn = true;
            req.session.user = { 
                user_id: user.user_id,
                username: user.username, 
                email: user.email 
            }; 

            // 💡 로그인 성공 시 /board로 이동
            res.redirect('/board'); 
        } else {
            res.render('login', { error: '유효하지 않은 이메일 또는 비밀번호입니다.' });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send('로그인 처리 중 서버 오류가 발생했습니다.');
    }
});

// 4. 회원가입 처리
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        await pool.query(query, [username, email, hashedPassword]);

        res.redirect('/login');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.render('signup', { error: '이미 등록된 이메일입니다.' });
        }
        console.error("Signup Error:", err);
        res.status(500).send('회원가입 처리 중 서버 오류가 발생했습니다.');
    }
});

// 5. 로그아웃 처리
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout Error:", err);
            return res.redirect('/'); 
        }
        // 로그아웃 후 메인 경로인 '/' (로그인 화면)으로 이동
        res.redirect('/'); 
    });
});

module.exports = router;