import Link from "next/link";
import { useRouter } from "next/router";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// util
import { combineClassNames } from "@src/libs/client/util";

// hooks
import useUser from "@src/libs/hooks/useUser";

const NavLink = ({
  url,
  name,
  shape,
}: {
  url: string;
  name: string;
  shape: ICON_SHAPE;
}) => {
  const { asPath } = useRouter();

  return (
    <li className="flex-1">
      <Link href={url}>
        <a
          className={combineClassNames(
            "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm hover:text-orange-600",
            asPath.includes(url) ? "text-orange-500" : ""
          )}
        >
          <Icon shape={shape} />
          <span className="text-sm select-none">{name}</span>
        </a>
      </Link>
    </li>
  );
};

const NavBar = () => {
  const { asPath } = useRouter();
  const { user } = useUser();

  return (
    <nav className="fixed w-full max-w-lg inset-x-0 bottom-0 mx-auto border-b-2 py-4 bg-white border-t-2">
      <ul className="flex justify-between">
        <li className="flex-1">
          <Link href="/">
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm hover:text-orange-600",
                asPath === "/" ||
                  asPath.includes("/?keyword=") ||
                  asPath.includes("/products")
                  ? "text-orange-500"
                  : ""
              )}
            >
              <Icon shape={ICON_SHAPE.HOME} />
              <span className="text-sm select-none">홈</span>
            </a>
          </Link>
        </li>
        <NavLink url="/community" name="동네생활" shape={ICON_SHAPE.NEWS} />
        <NavLink url="/chats" name="채팅" shape={ICON_SHAPE.CHAT} />
        <li className="flex-1">
          <Link href={`/profile/user/${user?.id}`}>
            <a
              className={combineClassNames(
                "flex flex-col justify-center items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none rounded-sm hover:text-orange-600",
                asPath === `/profile/user/${user?.id}` ||
                  asPath === "/profile/sale" ||
                  asPath === "/profile/purchase" ||
                  asPath === "/profile/favorite"
                  ? "text-orange-500"
                  : ""
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
