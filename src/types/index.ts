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
  DOTS_H,
  GIFT,
}

// 검색 조건
export enum SEARCH_CONDITION {
  ALL,
  AROUND,
}

//
export enum RECORD {
  FAVORITE = "favorite",
  SALE = "sale",
  PURCHASE = "purchase",
  RESERVED = "reserved",
  BUY = "buy",
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

export interface IAnswerForm {
  answer: string;
}
export interface IStramForm {
  title: string;
  price: number;
  description: string;
}
export interface IMessageForm {
  message: string;
}
