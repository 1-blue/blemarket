// 아이콘 형태
export enum ICON_SHAPE {
  HOME,
  NEWS,
  CHAT,
  CAMERA,
  USER,
  PLUS,
  HEART,
  CHECK,
  PENCIL,
  BACK,
  CART,
  BAG,
  PHOTO,
  STAR,
  TWITTER,
  GITHUB,
  SEARCH,
}

// 검색 조건
export enum SEARCH_CONDITION {
  ALL,
  AROUND,
}

// 로그인 방식
export enum LOGIN_TYPE {
  EMAIL = "email",
  PHONE = "phone",
}

//
export enum RECORD {
  FAVORITE = "favorite",
  SALE = "sale",
  PURCHASE = "purchase",
}

// api 리턴 값 ( 인터페이스... 상속으로 사용하기 )
export type ApiResponse = {
  ok: boolean;
  message: string;
};

// 간단한 유저 타입
export type SimpleUser = {
  id: number;
  name: string;
  avatar: string;
};

// 폼 전송 데이터
export interface IEnterForm {
  email?: string;
  phone?: string;
}
export interface ITokenForm {
  token: string;
}
export interface IUploadForm {
  photo?: FileList;
  name: string;
  price: number;
  description: string;
  keywords: string;
}
export interface IQuestionForm {
  question: string;
  latitude: number | null;
  longitude: number | null;
}
export interface IAnswerForm {
  answer: string;
}
export interface IUpdateForm {
  avatar?: FileList;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
}
export interface IStramForm {
  title: string;
  price: number;
  description: string;
}
export interface IMessageForm {
  message: string;
}
export interface IReviewForm {
  review: string;
  score: number;
}
export interface IChatForm {
  chat: string;
}
