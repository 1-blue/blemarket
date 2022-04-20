import React, { useCallback } from "react";
import { useRouter } from "next/router";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import ScrollProgress from "@src/components/common/ScrollProgress";

// component
import NavBar from "@src/components/NavBar";

interface IProps {
  children: React.ReactNode;
  hasTabBar?: boolean;
}

const Layout = ({ children, hasTabBar }: IProps) => {
  const router = useRouter();

  // 2022/03/19 - 뒤로가기 - by 1-blue
  const goBack = useCallback(() => router.back(), [router]);

  const getTitle = useCallback((asPath: string) => {
    if (
      asPath === "/" ||
      asPath.includes("/?keyword=") ||
      asPath.includes("/products")
    )
      return "홈";
    if (asPath.includes("/community")) return "동네생활";
    if (asPath.includes("/chats")) return "채팅";
    if (asPath.includes("/streams")) return "라이브";
    if (asPath.includes("/profile")) return "프로필";
    if (asPath.includes("/enter")) return "로그인";
    return "알 수 없는 페이지";
  }, []);

  return (
    <>
      <header className="fixed w-full max-w-lg inset-x-0 mx-auto border-b-2 py-4 bg-white shadow-lg z-10">
        <ScrollProgress />
        <h1 className="text-xl font-bold text-center">
          {getTitle(router.asPath)}
        </h1>
        <button
          type="button"
          onClick={goBack}
          className="absolute w-10 h-10 top-3 left-4 rounded-full text-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1"
        >
          <Icon shape={ICON_SHAPE.BACK} width={40} height={40} />
        </button>
      </header>
      <main className="w-full max-w-lg mx-auto pt-20 pb-24">{children}</main>
      {hasTabBar && <NavBar />}
    </>
  );
};

export default Layout;
