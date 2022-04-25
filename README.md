# 🐲 blemarket
> [당근마켓 클론코딩 - 노마드 코드](https://nomadcoders.co/carrot-market)을 수강하면서 기본 코드를 작성하고 필요한 기능들을 추가한 프로젝트입니다.

+ [trello](https://trello.com/b/AT4Z2NOe/blemarket)
+ [velog](https://velog.io/@1-blue/series/blemarket)
+ [blemarket - by vercel](https://blemarket.vercel.app)

<section align="center">
  <h2 style="text-align: center; margin: 0;">🛠️ 사용 기술 🛠️</h2>
  <img src="https://img.shields.io/badge/Next.js-818CF8?style=flat-square&logo=Next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCss-06B6D4?style=flat-square&logo=TailwindCss&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/SWR-818CF8?style=flat-square&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_S3-232F3E?style=flat-square&logo=AmazonAWS&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-818CF8?style=flat-square&logo=Vercel&logoColor=white" />
</section>

<section align="center">
  <h2 style="text-align: center; margin: 0;">💁‍♂️ 사용 툴 🙋‍♂️</h2>
  <a href="https://trello.com/b/AT4Z2NOe/blemarket">
    <img src="https://img.shields.io/badge/Trello-0052CC?style=flat-square&logo=Trello&logoColor=white" />
  </a>
  <a href="https://velog.io/@1-blue/series/blemarket">
    <img src="https://img.shields.io/badge/Velog-20C997?style=flat-square&logo=Velog&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=Git&logoColor=white" />
  <a href="https://github.com/1-blue/blemarket">
    <img src="https://img.shields.io/badge/GitHub-609926?style=flat-square&logo=GitHub&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Sourcetree-0052CC?style=flat-square&logo=Sourcetree&logoColor=white" />
  <img src="https://img.shields.io/badge/VsCode-007ACC?style=flat-square&logo=VisualStudioCode&logoColor=white" />
</section>

# 🙌 구현 기능
1. 상품 게시글 CRUD
2. 상품 게시글 검색 및 필터링
3. 커뮤니티 게시글 CRUD
4. 커뮤니티 게시글 거리 기반 검색
5. 댓글 CRD
6. 좋아요 CRUD
7. 채팅방/채팅 CR
8. 리뷰 CRD
9. 상품 상태 CRUD ( 판매중/예약중/좋아요/판매완료 및 구매완료 )
10. 상품 및 유저 이미지 처리 ( `AWS-S3` )

# 🚀 가이드 라인
## 1. 설치
```bash
git clone https://github.com/1-blue/blemarket.git

cd blemarket

npm install
```

## 2. .env 작성
```bash
# planet scale에서 배포용 url을 받아서 붙여넣으면 됨
DATABASE_URL="mysql://127.0.0.1:3306/blemarket"

COOKIE_SECRET=<작성>

BLEMARKET_AWS_REGION=<작성>
BLEMARKET_AWS_ACCESS_KEY=<작성>
BLEMARKET_AWS_SECRET_KEY=<작성>

# 이 부분은 versel로 배포할 때는 안 넣어줘도 자동으로 현재 페이지의 url이 들어옴
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
```

## 3. 실행
```bash
# 개발 모드 실행
npm run dev

# 배포 모드 실행
nm -rf .next && npm run build && npm start
```

## 4. 배포
>[vercel](https://vercel.com)을 이용한 배포

# 📸 실행 이미지/영상

## 🖼️ 이미지 🖼️
|로그인 페이지|메인 페이지|커뮤니티 페이지|채팅 페이지|프로필 페이지|
|:-:|:-:|:-:|:-:|:-:|
|<img src="https://user-images.githubusercontent.com/63289318/165023650-41cf94d4-7036-40c1-ae0f-97a7796ec7ed.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023648-7c89cfd6-8150-49e0-aa2f-477bbe12e702.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023647-69ce049d-4ac0-4ab0-bb12-42e7aa3a88b9.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023646-d649b23c-ac14-4f66-9b70-658de596cb39.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023651-60b4b728-8c0e-4bc1-90c8-ed0901e8770e.jpg" width="100%" />|

## 📽️ 실행 영상 📽️
1. 상품 검색 및 필터링
<img src="https://user-images.githubusercontent.com/63289318/165018145-3785b1d1-d72d-46ec-8490-894abae7e004.gif" width="100%" />
2. 상품 좋아요 및 댓글 및 채팅방 생성
<img src="https://user-images.githubusercontent.com/63289318/165023971-92f33af2-f1f9-4d1f-890b-94fe4b1e562c.gif" width="100%" />
3. 채팅
<img src="https://user-images.githubusercontent.com/63289318/165023955-dca04bba-d69a-41fb-ab58-27059bc4dd7d.gif" width="100%" />
4. 상품 상태 변경
<img src="https://user-images.githubusercontent.com/63289318/165023961-ac84e8df-85b1-483d-b0c7-77c911ee7ffc.gif" width="100%" />
