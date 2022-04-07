## 0. type
자주 사용할 타입 정리
```typescript
interface IUser {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ISimpleUser {
  id: number;
  name: string;
  avatar: string;
}

interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  keywords: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

interface IProductsWithEtc extends IProduct {
  records: SimpleUser[];
}

interface IProductsWithWriter extends IProduct {
  user: SimpleUser;
}

interface IPost {
  id: number;
  question: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

interface IPostWithEtc extends IPost {
  user: {
    name: string;
  };
  _count: {
    answers: number;
    recommendations: number;
  }
}

interface IAnswer = {
  id: number
  createdAt: Date
  updatedAt: Date
  answer: string
  userId: number
  postId: number
}

interface IPostWithUser extends IPost {
  user: ISimpleUser;
}

interface Review {
  id: number
  review: string
  score: number
  createdAt: Date
  updatedAt: Date
  createdById: number
  createdForId: number
}

interface ReviewWithWriter extends Review {
  createdBy: SimpleUser;
}

type Stream = {
  id: number
  title: string
  description: string
  price: number
  createdAt: Date
  updatedAt: Date
  userId: number
}
type Message = {
  id: number
  message: string
  createdAt: Date
  updatedAt: Date
  userId: number
  streamId: number
}
interface IStreamWithUser extends Stream {
  user: SimpleUser;
}
interface IMessageWithUser extends Message {
  user: SimpleUser;
}
```

## 1. users
### 1.1 GET /api/users/me
+ 역할: 로그인한 유저 데이터 요청
+ 전송 데이터: 쿠키
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  user: IUser
}
```
+ 응답 상태 코드
  1. `200`: 유저 데이터 가져오기 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 1.2 GET /api/users/me?kinds=
+ 역할: 로그인한 유저의 특정 데이터 요청
+ 전송 데이터 ( `query` )
```
{
  kinds: "favorite" | "sale" | "purchase"
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  products: {
    id: number;
    updatedAt: string;
    product: IProductsWithWriter;
  }
}
```
+ 응답 상태 코드
  1. `200`: 유저의 특정 데이터 가져오기 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 1.3 POST /api/users/me
+ 역할: 로그인한 유저의 프로필 변경
+ 전송 데이터 ( `body` )
```
{
  photo?:string;
  name: string;
  email: string;
  phone: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
}
```
+ 응답 상태 코드
  1. `200`: 유저의 특정 데이터 가져오기 성공
  2. `401`: 비로그인 상태에서 접근
  2. `409`: 이미 사용중인 이름/이메일/폰번호
  3. `500`: 서버측 에러 발생


### 1.4 POST /api/users/enter
+ 역할: 로그인 인증을 위한 토큰 생성 ( 휴대폰 or 이메일 인증 )
+ 전송 데이터 ( `body` )
```typescript
{
  email?: string;
  phone?: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  user: IUser
}
```
+ 응답 상태 코드
  1. `201`: 토큰 생성 성공
  2. `401`: 로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 1.5 POST /api/users/confirm
+ 역할: 로그인을 위한 토큰 유효성 검사
+ 전송 데이터 ( `body` )
```typescript
{
  token: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string
}
```
+ 응답 상태 코드
  1. `201`: 토큰 생성 성공
  2. `400`: 유효하지 않은 토큰
  2. `401`: 로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

## 2. products
### 2.1 GET /api/products?page={}&offset={}
+ 역할: 모든 상품들 요청
+ 전송 데이터 ( `none` )
```typescript
{
  page: number;
  offset: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  products: IProductsWithEtc[],
  productCount: number
}
```
+ 응답 상태 코드
  1. `200`: 모든 상품들 조회 성공
  2. `401`: 비로그인 상태에서 접근
  2. `404`: 존재하지 않은 페이지 정보 요청
  3. `500`: 서버측 에러 발생

### 2.2 GET /api/products?keyword={}&page={}&offset={}
+ 역할: 특정 키워드를 포함하는 상품 검색
+ 전송 데이터 ( `query` )
```
{
  keyword: string;
  page: number;
  offset: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  products: IProductsWithEtc[],
  productCount: number
}
```
+ 응답 상태 코드
  1. `200`: 특정 키워드를 포함하는 상품들 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 2.3 POST /api/products
+ 역할: 상품 생성
+ 전송 데이터 ( `body` )
```typescript
{
  name: string;
  price: number;
  description: string;
  image: string;
  keywords: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  product: IProduct
}
```
+ 응답 상태 코드
  1. `201`: 상품 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 2.4 GET /api/products/[id]
+ 역할: 특정 상품에 대한 상세 정보 요청 ( + 연관 상품 )
+ 전송 데이터 ( `query` )
```typescript
{
  id: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  product: IProductWithUser,
  relatedProducts: IProduct[],
}
```
+ 응답 상태 코드
  1. `200`: 특정 상품 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 2.5 POST /api/products/[id]/favorite
+ 역할: 특정 상품에 좋아요 추가
+ 전송 데이터 ( `query` )
```typescript
{
  id: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
}
```
+ 응답 상태 코드
  1. `200`: 특정 상품 좋아요 추가
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 상품에 좋아요 추가 요청
  3. `409`: 좋아요 누른 상태에서 좋아요 추가 요청
  3. `500`: 서버측 에러 발생

### 2.6 DELETE /api/products/[id]/favorite
+ 역할: 특정 상품에 좋아요 제거
+ 전송 데이터 ( `query` )
```typescript
{
  id: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
}
```
+ 응답 상태 코드
  1. `200`: 특정 상품에 좋아요 제거
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 상품에 좋아요 제거 요청
  3. `409`: 좋아요 누르지 않은 상태에서 좋아요 제거 요청
  3. `500`: 서버측 에러 발생

### 2.7 GET /api/products/[id]/favorite
+ 역할: 특정 상품에 좋아요 정보 요청
+ 전송 데이터 ( `query` )
```typescript
{
  id: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  isFavorite: boolean,
  favoriteCount: number,
}
```
+ 응답 상태 코드
  1. `200`: 특정 상품에 좋아요 제거
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 상품에 좋아요 제거 요청
  3. `409`: 좋아요 누르지 않은 상태에서 좋아요 제거 요청
  3. `500`: 서버측 에러 발생

## 3. posts
### 3.1 GET /api/posts
+ 역할: 해당 page의 offset만큼 게시글 요청
+ 전송 데이터 ( `query` )
```typescript
// 전달된 인자에 따라서 거리에 의해 게시글을 검색할지 판단함
{
  distance?: number;
  latitude?: number;
  longitude?: number;
  page: number;
  offset: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  products: IPostWithEtc[],
  postCount: number
}
```
+ 응답 상태 코드
  1. `200`: 모든 상품들 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 3.2 POST /api/posts
+ 역할: 게시글 생성
+ 전송 데이터 ( `body` )
```typescript
{
  question: string;
  latitude?: number;
  longitude?: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  post: IPost
}
```
+ 응답 상태 코드
  1. `201`: 게시글 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 3.3 GET /api/posts/[id]
+ 역할: 특정 게시글 정보 요청
+ 전송 데이터 ( `query` )
```typescript
{
  postId: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  post: IPostWithUser,
}
```
+ 응답 상태 코드
  1. `200`: 특정 게시글 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `500`: 서버측 에러 발생

### 3.4 POST /api/posts/[id]/recommendation
+ 역할: 특정 게시글에 궁금해요 추가 요청
+ 전송 데이터 ( `query` )
```typescript
{
  postId: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
}
```
+ 응답 상태 코드
  1. `201`: 궁금해요 추가 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `409`: 이미 궁금해요를 누른 상태
  5. `500`: 서버측 에러 발생

### 3.5 DELETE /api/posts/[id]/recommendation
+ 역할: 특정 게시글에 궁금해요 제거 요청
+ 전송 데이터 ( `query` )
```typescript
{
  postId: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
}
```
+ 응답 상태 코드
  1. `200`: 궁금해요 제거 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `409`: 이미 궁금해요를 누른 상태
  5. `500`: 서버측 에러 발생

### 3.6 GET /api/posts/[id]/recommendation
+ 역할: 특정 게시글의 궁금해요 정보 요청
+ 전송 데이터 ( `query` )
```typescript
{
  postId: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  isRecommendation: boolean,
  recommendationCount: number,
}
```
+ 응답 상태 코드
  1. `200`: 궁금해요 제거 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `409`: 이미 궁금해요를 누른 상태
  5. `500`: 서버측 에러 발생

### 3.7 POST /api/posts/[id]/answer
+ 역할: 특정 게시글에 댓글 추가 요청
+ 전송 데이터 ( `query` )
```typescript
{
  postId: number;
  answer: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
}
```
+ 응답 상태 코드
  1. `201`: 답변 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `500`: 서버측 에러 발생

### 3.8 GET /api/posts/[id]/answer?page={}&offset={}
+ 역할: 특정 게시글에 댓글들 요청
+ 전송 데이터 ( `query` )
```typescript
{
  postId: number;
  page: number;
  offset: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  answers: {
    id: number;
    answer: string;
    updatedAt: string;
    user: SimpleUser;
  }[];
  answerCount: number;
}
```
+ 응답 상태 코드
  1. `200`: 답변들 가져오기
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `500`: 서버측 에러 발생

## 4. reviews
### 4.1 GET /api/reviews
+ 역할: 로그인한 사용자의 리뷰 요청
+ 전송 데이터: `none`
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  reviews: ReviewWithWriter[]
}
```
+ 응답 상태 코드
  1. `200`: 모든 상품들 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

## 5. streams
### 5.1 POST /api/streams
+ 역할: 스트림 생성
+ 전송 데이터
```typescript
{
  title: string;
  price: number;
  description: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  stream: Stream
}
```
+ 응답 상태 코드
  1. `201`: 스트림 생성 완료
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 5.2 GET /api/streams?page={}&offset={}
+ 역할: 스트림들 가져오기
+ 전송 데이터 ( `query` )
```typescript
{
  page: number;
  offset: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  streams: {
    id: number;
    title: string;
    user: SimpleUser;
  }[]
  streamCount: number
}
```
+ 응답 상태 코드
  1. `200`: 스트림들 가져오기 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 5.3 GET /api/streams/[id]
+ 역할: 특정 스트림 가져오기
+ 전송 데이터 ( `query` )
```typescript
{
  streamId: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  stream: IStreamWithUser,
  messageCount: number,
}
```
+ 응답 상태 코드
  1. `200`: 특정 스트림 가져오기 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않은 스트림에 메시지 생성 요청
  4. `500`: 서버측 에러 발생

### 5.4 POST /api/streams/[id]/message
+ 역할: 메시지 생성 요청
+ 전송 데이터 ( `query`, `body` )
```typescript
{
  streamId: number;
  message: string;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  messageWithUser: IMessageWithUser
}
```
+ 응답 상태 코드
  1. `201`: 메시지 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않은 스트림에 메시지 생성 요청
  4. `500`: 서버측 에러 발생

### 5.5 GET /api/streams/[id]/message?page={}&offset={}
+ 역할: 메시지들 요청
+ 전송 데이터 ( `query`, `body` )
```typescript
{
  streamId: number;
  page: number;
  offset: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  messages: {
    id: number;
    message: string;
    updatedAt: Date;
    user: SimpleUser;
  }[],
}
```
+ 응답 상태 코드
  1. `200`: 메시지 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않은 스트림에 메시지 생성 요청
  4. `500`: 서버측 에러 발생