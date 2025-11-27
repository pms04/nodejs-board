// src/routes/board.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const PAGE_SIZE = 10;

// 💡 [추가] 로그인 필수 미들웨어: 로그인 안 되어 있으면 /login으로 리다이렉트
const checkAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};

// 💡 [추가] 모든 뷰에 세션 정보를 전달하는 미들웨어
router.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || null;
    next();
});


// -----------------------------------------------------
// ✅ 모든 라우터에 checkAuth 미들웨어 적용 및 경로 /board 기준으로 수정
// -----------------------------------------------------

// 1. 목록 표시 및 검색 (GET /)
router.get('/', checkAuth, async (req, res) => { 
    let page = parseInt(req.query.page) || 1;
    let search = req.query.search || '';
    const offset = (page - 1) * PAGE_SIZE;

    try {
        let totalCountQuery = 'SELECT COUNT(*) AS count FROM posts';
        let postsQuery = `
            SELECT id, title, author, views, created_at 
            FROM posts
        `;
        let countParams = [];
        let postParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            totalCountQuery += ' WHERE title LIKE ?';
            postsQuery += ' WHERE title LIKE ?';
            countParams.push(searchPattern);
            postParams.push(searchPattern); 
        }
        
        postsQuery += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        postParams.push(PAGE_SIZE);
        postParams.push(offset);

        const [countResult] = await pool.query(totalCountQuery, countParams);
        const totalCount = countResult[0].count;
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const [posts] = await pool.query(postsQuery, postParams);

        res.render('list', {
            posts: posts,
            currentPage: page,
            totalPages: totalPages,
            search: search
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('목록 조회 중 오류가 발생했습니다.');
    }
});


// 2. 게시물 작성 (쓰기) 화면 (GET /write)
router.get('/write', checkAuth, (req, res) => { 
    res.render('write', { post: null }); 
});

// 3. 게시물 작성 처리 (POST /write)
router.post('/write', checkAuth, async (req, res) => { 
    const { title, content, author } = req.body; 

    if (!title || !content || !author) {
        return res.status(400).send('제목, 내용, 작성자는 필수입니다.');
    }

    try {
        await pool.query(
            'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
            [title, content, author]
        );
        // 💡 [수정] 리다이렉트 경로를 '/board'로 변경
        res.redirect('/board');
    } catch (error) {
        console.error(error);
        res.status(500).send('게시물 작성 중 오류가 발생했습니다.');
    }
});

// 4. 게시물 수정 화면 (GET /edit/:id)
router.get('/edit/:id', checkAuth, async (req, res) => { 
    const postId = req.params.id;
    try {
        const [postResult] = await pool.query(
            'SELECT * FROM posts WHERE id = ?',
            [postId]
        );

        if (postResult.length === 0) {
            return res.status(404).send('수정할 게시물을 찾을 수 없습니다.');
        }

        res.render('write', { post: postResult[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send('게시물 수정 페이지 로딩 중 오류가 발생했습니다.');
    }
});

// 5. 게시물 수정 처리 (POST /edit/:id)
router.post('/edit/:id', checkAuth, async (req, res) => { 
    const postId = req.params.id;
    const { title, content, author } = req.body; 

    if (!title || !content || !author) {
        return res.status(400).send('제목, 내용, 작성자는 필수입니다.');
    }

    try {
        const [updateResult] = await pool.query(
            'UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?',
            [title, content, author, postId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).send('수정할 게시물을 찾을 수 없습니다.');
        }

        // 💡 [수정] 리다이렉트 경로를 '/board/:id'로 변경
        res.redirect(`/board/${postId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('게시물 수정 처리 중 오류가 발생했습니다.');
    }
});

// 6. 게시물 삭제 처리 (POST /delete/:id)
router.post('/delete/:id', checkAuth, async (req, res) => { 
    const postId = req.params.id;

    try {
        const [deleteResult] = await pool.query(
            'DELETE FROM posts WHERE id = ?',
            [postId]
        );

        if (deleteResult.affectedRows === 0) {
            return res.status(404).send('삭제할 게시물을 찾을 수 없습니다.');
        }

        // 💡 [수정] 리다이렉트 경로를 '/board'로 변경
        res.redirect('/board');
    } catch (error) {
        console.error(error);
        res.status(500).send('게시물 삭제 중 오류가 발생했습니다.');
    }
});

// 7. 상세 보기 및 조회수 증가 (GET /:id) 
router.get('/:id', checkAuth, async (req, res) => { 
    const postId = req.params.id;

    if (isNaN(parseInt(postId))) {
        return res.status(400).send('잘못된 게시물 ID 형식입니다.');
    }

    try {
        await pool.query('START TRANSACTION');
        
        await pool.query(
            'UPDATE posts SET views = views + 1 WHERE id = ?',
            [postId]
        );
        
        const [postResult] = await pool.query(
            'SELECT * FROM posts WHERE id = ?',
            [postId]
        );
        
        await pool.query('COMMIT');

        if (postResult.length === 0) {
            return res.status(404).send('게시물을 찾을 수 없습니다.');
        }
        
        res.render('detail', { post: postResult[0] });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).send('게시물 조회 중 오류가 발생했습니다.');
    }
});

module.exports = router;