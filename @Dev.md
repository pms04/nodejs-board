# 💻 @Dev.md (개발 기록 및 이슈 트래킹)

## 📌 주요 결정 사항 (2025-11-28)

* **스타일링 방식:** 처음 적용했던 미니멀리즘 CSS(`board.css`)는 제거하고, 초기 상태의 인라인 스타일 기반 HTML로 복구함.
* **페이지네이션 로직:** `PAGE_BLOCK_SIZE`를 5로 설정하여 페이지 버튼을 5개 단위로 끊어 표시하도록 최종 확정.
* **파일 업로드 구현:** `multer`를 사용하여 이미지 업로드 기능을 추가함.
    * 저장 경로: `src/public/uploads`
    * DB 컬럼: `image_url` (파일명 저장)
    * 파일 크기 제한: 5MB

## 🐛 해결된 이슈

* `ReferenceError: startPage is not defined`: `src/routes/board.js`에서 페이지네이션 변수(`startPage`, `endPage`, `totalPages`)를 `res.render`로 전달하지 않아 발생. **→ 해결 완료.**
* `node_modules` 경고 다수 발생: `.gitignore` 파일을 추가하고 `git rm -r --cached node_modules` 명령으로 추적 대상에서 제외하여 **→ 해결 완료.**

## 💡 향후 계획

1.  **보안 강화:** SQL Injection 방어 코드 강화 (현재는 `mysql2/promise`가 기본적으로 PreparedStatement를 지원).
2.  **프론트엔드 개선:** Bootstrap 또는 Tailwind CSS를 사용하여 유지보수하기 쉬운 형태로 스타일링 재작업.
3.  **로그인 기능 추가:** 사용자 인증 및 권한 관리 기능 구현.