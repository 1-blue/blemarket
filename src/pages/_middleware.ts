import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (req: NextRequest, fe: NextFetchEvent) => {
  // 크롤링 허용
  if (req.ua?.isBot) return NextResponse.next();

  // api 요청은 자체적으로 보호됨
  if (req.url.includes("/api")) return NextResponse.next();

  if (req.url.includes("/enter")) {
    // 로그인 후 로그인 페이지로 이동 시 메인 페이지로 리다이렉트
    if (req.cookies["blemarket-session"]) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // 그 외 로그인 페이지 이동 시 이후 조건은 무시
    return NextResponse.next();
  }

  // 쿠키의 존재 유무에 의해서만 로그인 여부를 판단
  if (req.cookies["blemarket-session"]) return NextResponse.next();

  // 쿠키 미소유 시 로그인 페이지로 리다이렉트
  const url = req.nextUrl.clone();
  url.pathname = "/enter";
  return NextResponse.redirect(url);
};
