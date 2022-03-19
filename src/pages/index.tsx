import type { NextPage } from "next";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// component
import SideButton from "@src/components/SideButton";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col space-y-5 divide-y">
      {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
        <Link key={i} href={`items/${i}`}>
          <a className="flex justify-between px-4 pt-4 first:pt-0">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-400 rounded-md" />
              <div className="flex flex-col pt-2">
                <h3 className="text-sm font-medium text-gray-900">
                  New iPhone 14
                </h3>
                <span className="text-xs text-gray-500">Black</span>
                <span className="font-medium mt-1 text-gray-900">$95</span>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-0.5 text-gray-700 text-sm">
                <Icon shape={ICON_SHAPE.HEART} width={4} height={4} />
                <span>1</span>
              </div>
              <div className="flex items-center space-x-0.5 text-gray-700 text-sm">
                <Icon shape={ICON_SHAPE.CHAT} width={4} height={4} />
                <span>1</span>
              </div>
            </div>
          </a>
        </Link>
      ))}
      <Link href="/items/upload">
        <a>
          <SideButton>
            <Icon shape={ICON_SHAPE.PLUS} />
          </SideButton>
        </a>
      </Link>
    </div>
  );
};

export default Home;
