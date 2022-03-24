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
}

// 로그인 방식
export enum LOGIN_TYPE {
  EMAIL = "email",
  PHONE = "phone",
}

// 로그인 폼 전송 데이터
export interface IEnterForm {
  email?: string;
  phone?: string;
}
export interface ITokenForm {
  token: string;
}
