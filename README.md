# Round project(동글동글)
동물보호센터의 인력 부족에서 파생되는 유기견/유기묘 문제를 해결하기 위해
‘지역구별 동물보호센터’ **지도 검색**과 정보공유 **게시판**을 제공하는 **자원봉사 참여 유도 플랫폼**

### ✅ 배포 URL

https://round-project-ad129.web.app/

- 동물보호센터에 자원봉사를 희망하는 사람들을 위한 애플리케이션입니다.
- '동글동글'은 동물보호센터 api에 등록된 동물보호센터를 지역구별로 지도로 확인할 수 있습니다.
- 게시판을 통해 동물보호센터/개인 간의 소통이 가능합니다.
- 동물보호소 자원봉사에 관심 있으신 분들 중, 정보가 부족해서 선뜻 참여하지 않는다는 점을 착안해서 만들게 되었습니다.

&nbsp;

## 🧐 프로젝트 구성

- React + TypeScript + Vite 
- Tailwind CSS, Styled Components
- React Query, Recoil
- 외부 api
  - 카카오맵 api : https://apis.map.kakao.com/web/guide/
  - 동물보호센터 api : https://www.data.go.kr/data/15025454/standard.do?recommendDataYn=Y

&nbsp;

## 🏄‍♀️ 기획 및 진행 과정 + 트러블 슈팅(노션)

https://www.notion.so/ogi-front-end/round-project-acec7378b4df47099a240c8a2a3e0327

&nbsp;

## 😎 페이지 별 주요 기능

### Login / createAccount

- 이메일/비밀번호를 통한 회원 가입/로그인
- 구글 계정 연동으로 소셜 로그인
- 비밀번호 재설정 이메일 전송

| ![image.jpg1](https://github.com/okyewon/round-project/assets/141378574/9f3d90b3-b6eb-4f2c-9a8b-c46f8ec4f01b) | ![image.jpg2](https://github.com/okyewon/round-project/assets/141378574/b01a85b6-7037-4e20-8c50-3b416747d4b3) | ![image.jpg3](https://github.com/okyewon/round-project/assets/141378574/f3d51860-b7d5-4781-90d6-85d2b3f57fc2) |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |

&nbsp;

### Home

- 동물보호센터 api로 필터링 된 지역구 중에서 관심 지역 검색
- 지도 페이지로 지역 키워드 전달

<img width="100%" src="https://github.com/okyewon/round-project/assets/141378574/2d0585a2-81ce-49b9-beec-b71614147493">

&nbsp;

### Map

- Home 에서 전달 받은 데이터가 있을 경우, 해당 지역과 일치하는 동물보호소 정보 필터링
- 없을 경우, 지도 페이지에서 지역 선택 및 검색 가능
- 지도 검색
  - 리스트 및 마커 출력 && 클릭 시 infowindow 노출
  - 해당 지역 내의 보호소가 다 보이도록 위치 이동 && 범위 설정

<img width="100%" src="https://github.com/okyewon/round-project/assets/141378574/957fa8cf-51cb-4792-9f15-6a59ba0c668c">

&nbsp;

### Board

- 게시물 필터 기능
  - 작성자(전체/동물보호소/개인)
  - 키워드(제목+내용)
- 작성자와 현재 user가 일치할 때
  - 수정하기/삭제하기
- 작성자와 현재 user가 일치하지 않을 때
  - 북마크 기능
- 페이지네이션 기능

<img width="100%" src="https://github.com/okyewon/round-project/assets/141378574/cfa09892-8b8d-44aa-910d-8561e51bb110">

&nbsp;

### PostWrite

- 글쓰기 페이지
- 제목+내용 필수 작성
- 사진 업로드 선택

&nbsp;

### PostDetail

- 게시물 상세 페이지
- 사진 및 글 노출 && 줄바꿈 기능
- 댓글 기능

<img width="100%" src="https://github.com/okyewon/round-project/assets/141378574/375a146c-d82a-4b8c-9186-9e24dbc393d2">

&nbsp;

### Mypage

- 좌측: 고정 사이드 바
  - 프로필 정보
  - 마이페이지 네비게이션
  - 로그아웃
- 우측: 하위 컴포넌트들 렌더링
  - 북마크 컬렉션
  - 내가 쓴 게시물 컬렉션
  - 계정 정보 수정(이름 또는 비밀번호 재설정)

<img width="100%" src="https://github.com/okyewon/round-project/assets/141378574/46b4cb65-428f-4035-98c5-1bd7a567effa">
