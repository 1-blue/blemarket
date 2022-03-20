import Link from "next/link";
import { useRouter } from "next/router";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// util
import { combineClassNames } from "@src/libs/util";

const NavBar = () => {
  const { asPath } = useRouter();

  return (
    <nav className="fixed w-full max-w-lg inset-x-0 bottom-0 mx-auto border-b-2 py-4 bg-white border-t-2">
      <ul className="flex justify-between">
        <li className="flex-1">
          <Link href="/">
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm",
                asPath === "/" || asPath.includes("/items")
                  ? "text-orange-500"
                  : ""
              )}
            >
              <Icon shape={ICON_SHAPE.HOME} />
              <span className="text-sm select-none">홈</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/community">
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm",
                asPath.includes("/community") ? "text-orange-500" : ""
              )}
            >
              <Icon shape={ICON_SHAPE.NEWS} />
              <span className="text-sm select-none">동네생활</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/chats">
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm",
                asPath.includes("/chats") ? "text-orange-500" : ""
              )}
            >
              <Icon shape={ICON_SHAPE.CHAT} />
              <span className="text-sm select-none">채팅</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/streams">
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm",
                asPath.includes("/streams") ? "text-orange-500" : ""
              )}
            >
              <Icon shape={ICON_SHAPE.CAMERA} />
              <span className="text-sm select-none">라이브</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/profile">
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm",
                asPath.includes("/profile") ? "text-orange-500" : ""
              )}
            >
              <Icon shape={ICON_SHAPE.USER} />
              <span className="text-sm select-none">나의 정보</span>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
