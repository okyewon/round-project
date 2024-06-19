# Round project(동글동글)

### 배포 URL

https://round-project-ad129.web.app/

- 동물보호센터에 자원봉사를 희망하는 사람들을 위한 애플리케이션입니다.
- '동글동글'은 지역구마다 동물보호센터 api에 등록된 동물보호센터를 지도로 확인할 수 있고, 게시판을 통해 동물보호센터/개인 간의 소통이 가능합니다.
- 반려동물과 함께하는 사람들, 동물을 사랑하는 사람들 중에 동물보호소 자원봉사에 관심 있으신 분들이 많습니다.
- 하지만, 접근법을 몰라서 혹은 정보가 부족해서 선뜻 나서지 않는 분들이 대부분이라는 점을 착안해서 만들게 되었습니다.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 페이지 별 주요 기능

### Login / createAccount

- 이메일/비밀번호를 통한 회원 가입/로그인
- 구글 계정 연동으로 소셜 로그인
- 비밀번호 재설정 이메일 전송

### Home

- 동물보호센터 api로 필터링 된 지역구 중에서 관심 지역 검색
- 지도 페이지로 지역 키워드 전달

### Map

- Home 에서 전달 받은 데이터가 있을 경우, 해당 지역과 일치하는 동물보호소 정보 필터링
- 없을 경우, 지도 페이지에서 지역 선택 및 검색 가능
- 지도 검색
  - 리스트 및 마커 출력 && 클릭 시 infowindow 노출
  - 해당 지역 내의 보호소가 다 보이도록 위치 이동 && 범위 설정

### Board

- 게시물 필터 기능
  - 작성자(전체/동물보호소/개인)
  - 키워드(제목+내용)
- 작성자와 현재 user가 일치할 때
  - 수정하기/삭제하기
- 작성자와 현재 user가 일치하지 않을 때
  - 북마크 기능
- 숫자 페이지네이션 기능

### PostWrite

- 글쓰기 페이지
- 제목+내용 필수 작성
- 사진 업로드 선택

### PostDetail

- 게시물 상세 페이지
- 사진 및 글 노출 && 줄바꿈 기능
- 댓글 기능

### Mypage

- 좌측: 프로필 정보 && 마이페이지 네비게이션
- 우측: 하위 컴포넌트들 렌더링
  - 북마크 컬렉션
  - 내가 쓴 게시물 컬렉션
  - 계정 정보 수정(이름 또는 비밀번호 재설정)
