// 2022/03/21 - 나열된 클래스명을 공백기준으로 합친 문자열로 만들어주는 헬퍼함수 - by 1-blue
export const combineClassNames = (...classname: string[]) =>
  classname.join(" ");
