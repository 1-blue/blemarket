import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (req: NextRequest, fe: NextFetchEvent) => {
  if (req.ua?.isBot)
    return new Response("Plz don't be a bot. Be human.", { status: 403 });

  // api 요청은 자체적으로 보호됨
  if (req.url.includes("/api")) return NextResponse.next();

  // 로그인 페이지는 검사할 필요 없음
  if (req.url.includes("/enter")) return NextResponse.next();

  // 쿠키의 존재 유무에 의해서만 로그인 여부를 판단 ( 유효성검사는 DB를 검색해봐야하므로 여기서 못하고 useUser에서 처리함 )
  if (req.cookies["blemarket-session"]) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/enter";
  return NextResponse.redirect(url);
};
