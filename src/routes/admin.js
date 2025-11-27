// src/routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Promise 기반 pool 사용

// Middleware to check for admin user
const isAdmin = (req, res, next) => {
    // 💡 투두스 코드에서는 email을 사용했지만, 여기서는 req.session.user가 있는지 확인하고
    // 이메일이 'admin@example.com'인지 확인
    if (req.session.isLoggedIn && req.session.user.email === 'admin@example.com') {
        return next();
    }
    // 관리자가 아니면 게시판 메인으로 리다이렉트
    res.redirect('/'); 
};

// Admin page - list all users with pagination
router.get('/', isAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    try {
        // 총 사용자 수 조회
        const [countResult] = await pool.query('SELECT COUNT(*) AS count FROM users');
        const totalUsers = countResult[0].count;
        const totalPages = Math.ceil(totalUsers / limit);

        // 사용자 목록 조회
        const query = 'SELECT user_id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const [results] = await pool.query(query, [limit, offset]);
        
        res.render('admin/admin', { // admin 폴더 아래 admin.ejs를 가정
            title: 'Admin - User Management',
            user: req.session.user,
            users: results,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        console.error("Admin List Error:", err);
        res.status(500).send('관리자 목록 조회 중 오류가 발생했습니다.');
    }
});

// Update user (비밀번호 제외)
router.post('/update/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body; // user_name 대신 username 사용

    try {
        const query = 'UPDATE users SET username = ?, email = ? WHERE user_id = ?';
        await pool.query(query, [username, email, id]);
        res.redirect('/admin');
    } catch (err) {
        console.error("Admin Update Error:", err);
        res.status(500).send('사용자 정보 수정 중 오류가 발생했습니다.');
    }
});

// Delete user
router.get('/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM users WHERE user_id = ?';
        await pool.query(query, [id]);
        res.redirect('/admin');
    } catch (err) {
        console.error("Admin Delete Error:", err);
        res.status(500).send('사용자 삭제 중 오류가 발생했습니다.');
    }
});

module.exports = router;