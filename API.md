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

interface IPostWithAnswer extends IPost {
  user: ISimpleUser;
  _count: {
    recommendations: number;
  };
  answers: {
    id: number;
    answer: string;
    updatedAt: Date;
    user: ISimpleUser;
  }[];
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
### 2.1 GET /api/products
+ 역할: 모든 상품들 요청 ( >> 추후에 페이지네이션 적용 )
+ 전송 데이터: `none`
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  products: IProductsWithEtc[]
}
```
+ 응답 상태 코드
  1. `200`: 모든 상품들 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 2.2 POST /api/products
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

### 2.3 GET /api/products/[id]
+ 역할: 특정 상품에 대한 상세 정보 요청 ( + 연관 상품, 본인 좋아요 여부 )
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
  isFavorite: boolean
}
```
+ 응답 상태 코드
  1. `200`: 특정 상품 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `500`: 서버측 에러 발생

### 2.4 POST /api/products/[id]/favorite
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

### 2.5 DELETE /api/products/[id]/favorite
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

## 3. posts
### 3.1 GET /api/posts
+ 역할: 모든 게시글들 요청 ( >> 추후에 페이지네이션 적용 )
+ 전송 데이터 ( `query` )
```typescript
// 전달된 인자에 따라서 거리에 의해 게시글을 검색할지 판단함
{
  distance?: number;
  latitude?: number;
  longitude?: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  products: IPostWithEtc[]
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
  id: number;
}
```
+ 응답 데이터
```typescript
{
  ok: boolean,
  message: string,
  post: IPostWithAnswer,
  isRecommendation: boolean
}
```
+ 응답 상태 코드
  1. `200`: 특정 게시글 조회 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `500`: 서버측 에러 발생

### 3.4 POST /api/posts/[id]/answer
+ 역할: 특정 게시글에 궁금해요 추가 요청
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
  1. `201`: 답변 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `409`: 이미 궁금해요를 누른 상태
  5. `500`: 서버측 에러 발생

### 3.5 DELETE /api/posts/[id]/answer
+ 역할: 특정 게시글에 궁금해요 제거 요청
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
  1. `201`: 답변 생성 성공
  2. `401`: 비로그인 상태에서 접근
  3. `404`: 존재하지 않는 게시글 요청
  4. `409`: 이미 궁금해요를 누른 상태
  5. `500`: 서버측 에러 발생

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