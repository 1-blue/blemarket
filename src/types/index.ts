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

// api 리턴 값 ( 인터페이스... 상속으로 사용하기 )
export interface IMutationResult {
  ok: boolean;
  message: string;
}

// 로그인 방식
export enum LOGIN_TYPE {
  EMAIL = "email",
  PHONE = "phone",
}

// 간단한 유저 타입
export interface SimpleUser {
  id: number;
  name: string;
  avatar: string;
}

// 폼 전송 데이터
export interface IEnterForm {
  email?: string;
  phone?: string;
}
export interface ITokenForm {
  token: string;
}
export interface IUploadForm {
  name: string;
  price: number;
  description: string;
  keywords: string;
}
export interface IQuestionForm {
  question: string;
}
export interface IAnswerForm {
  answer: string;
}
