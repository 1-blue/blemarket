// 2022/03/21 - 나열된 클래스명을 공백기준으로 합친 문자열로 만들어주는 헬퍼함수 - by 1-blue
export const combineClassNames = (...classname: string[]) =>
  classname.join(" ");

// 2022/04/06 - 이미지 경로 붙여주는 헬퍼함수 - by 1-blue
export const combinePhotoUrl = (photo: string) =>
  `https://blemarket.s3.ap-northeast-2.amazonaws.com/${photo}`;

// 2022/04/06 - 금액에 구분자 넣어주는 헬퍼함수 - by 1-blue
export const priceWithCommas = (price: number) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
