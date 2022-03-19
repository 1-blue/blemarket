import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "./common/Icon";

const NavBar = () => {
  return (
    <nav className="fixed w-full max-w-lg inset-x-0 bottom-0 mx-auto border-b-2 py-4 bg-white border-t-2">
      <ul className="flex justify-between">
        <li className="flex-1">
          <Link href="/">
            <a className="flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm">
              <Icon shape={ICON_SHAPE.HOME} />
              <span className="text-sm select-none">홈</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/community">
            <a className="flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm">
              <Icon shape={ICON_SHAPE.NEWS} />
              <span className="text-sm select-none">동네생활</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/chats">
            <a className="flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm">
              <Icon shape={ICON_SHAPE.CHAT} />
              <span className="text-sm select-none">채팅</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/streams">
            <a className="flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm">
              <Icon shape={ICON_SHAPE.CAMERA} />
              <span className="text-sm select-none">라이브</span>
            </a>
          </Link>
        </li>
        <li className="flex-1">
          <Link href="/profile">
            <a className="flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm">
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
