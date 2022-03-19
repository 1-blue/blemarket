import React, { useCallback } from "react";
import { useRouter } from "next/router";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// component
import NavBar from "@src/components/NavBar";

interface IProps {
  children: React.ReactNode;
  title: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
}

const Layout = ({ children, title, canGoBack, hasTabBar }: IProps) => {
  const router = useRouter();

  // 2022/03/19 - 뒤로가기 - by 1-blue
  const goBack = useCallback(() => router.back(), [router]);

  return (
    <>
      <header className="fixed w-full max-w-lg inset-x-0 mx-auto border-b-2 py-4 bg-white shadow-lg">
        <h1 className="text-xl font-bold text-center">{title}</h1>
        {canGoBack && (
          <button
            type="button"
            onClick={goBack}
            className="absolute w-10 h-10 top-3 left-4"
          >
            <Icon shape={ICON_SHAPE.BACK} width={10} height={10} />
          </button>
        )}
      </header>
      <main className="w-full max-w-lg mx-auto pt-20 pb-24">{children}</main>
      {hasTabBar && <NavBar />}
    </>
  );
};

export default Layout;
