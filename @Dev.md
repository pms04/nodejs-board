# 💻 @Dev.md (개발 기록 및 이슈 트래킹)

## 📌 주요 결정 사항 (2025-11-28 최종 업데이트)

* **인증 및 라우팅:**
    * **사용자 인증 기능 구현 완료:** `src/routes/auth.js`를 통해 이메일 기반 로그인, 회원가입, 세션 관리(`express-session`) 기능 통합 완료.
    * **경로 분리:** `/` 경로를 인증(`authRouter`)이 담당하며, `/board`는 게시판(`boardRouter`)이 담당하도록 설정.
    * **비밀번호 처리:** `bcryptjs`를 사용하여 비밀번호 해싱 처리 적용.
* **스타일링 방식:** 인증 및 게시판 뷰에 **미니멀리즘 인라인 스타일 기반 EJS**를 최종 적용하여 기능을 우선 구현.
* **페이지네이션 로직:** `PAGE_BLOCK_SIZE`를 5로 설정하여 페이지 버튼을 5개 단위로 끊어 표시하도록 최종 확정.
* **파일 업로드 구현:** (보류/제거됨) 현재 버전에서는 `posts` 테이블에 `image_url` 컬럼이 없고, `multer`를 사용하는 파일 업로드 기능 구현은 **일단 제외**함. (향후 계획으로 이동)
* **CRUD 권한 관리:** (미흡) 현재 게시물 작성 시 `author`를 **세션 사용자 이름으로 자동 입력하는 로직**이 아직 적용되지 않았으며, `src/routes/board.js`에서 **작성자 필드를 폼(`req.body.author`)으로부터 수동으로 받고 있음**. (🚨 다음 스프린트 주요 목표)

## 🐛 해결된 이슈

* **인증 DB 컬럼 오류 해결:** `Login Error: Unknown column 'email'` 오류 발생에 따라, `users` 테이블에 `email` 컬럼을 추가하고 `src/routes/auth.js`의 쿼리를 `WHERE email = ?`로 수정하여 로그인 로직을 복구함.
* `ReferenceError: startPage is not defined`: `src/routes/board.js`에서 페이지네이션 변수(`startPage`, `endPage`, `totalPages`)를 `res.render`로 전달하지 않아 발생. **→ 해결 완료.**
* `node_modules` 경고 다수 발생: `.gitignore` 파일을 추가하고 `git rm -r --cached node_modules` 명령으로 추적 대상에서 제외하여 **→ 해결 완료.**

## 💡 향후 계획 (Next Sprint Goals)

1.  **게시물 작성자 자동 할당 (최우선):**
    * `src/routes/board.js`에서 게시물 작성 시 `req.body.author` 대신 **`req.session.user.username`**을 사용하도록 로직 수정.
    * `src/views/write.ejs`에서 작성자(`author`) 입력 필드 제거.
2.  **게시물 수정/삭제 권한 제어:**
    * `src/routes/board.js`의 수정(`edit/:id`) 및 삭제(`delete/:id`) 로직에 **현재 로그인 사용자가 게시물 작성자인지** 확인하는 권한 체크 미들웨어 또는 쿼리 조건 (`AND author = ?`) 추가.
3.  **보안 강화:** SQL Injection 방어 코드 강화 (현재는 `mysql2/promise`가 기본적으로 PreparedStatement를 지원).
4.  **프론트엔드 개선:** Bootstrap 또는 Tailwind CSS를 사용하여 유지보수하기 쉬운 형태로 스타일링 재작업.
5.  **파일 업로드 기능 추가:** `posts` 테이블에 `image_url` 컬럼을 추가하고 `multer`를 통합하여 이미지 업로드 기능 구현.