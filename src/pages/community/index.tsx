import type { NextPage } from "next";
import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// component
import SideButton from "@src/components/SideButton";

const Community: NextPage = () => {
  return (
    <div className="px-4 space-y-8">
      <Link href={`/community/1`}>
        <a>
          <span className="inline-block bg-gray-200 px-2 py-1 rounded-full text-xs mb-1">
            동네질문
          </span>
          <div className="mb-2">
            <span className="text-orange-500 font-semibold">Q.</span> What is
            the best mandu restaurant?
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">니꼬</span>
            <span className="text-gray-500 text-sm font-semibold">
              18시간 전
            </span>
          </div>
          <div className="flex py-2 border-y border-b-2 space-x-4">
            <span className="flex items-center space-x-1">
              <Icon shape={ICON_SHAPE.CHECK} width={4} height={4} />
              <span>궁금해요 1</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon shape={ICON_SHAPE.CHAT} width={4} height={4} />
              <span>답변 1</span>
            </span>
          </div>
        </a>
      </Link>

      <Link href="/community/write">
        <a>
          <SideButton>
            <Icon shape={ICON_SHAPE.PENCIL} />
          </SideButton>
        </a>
      </Link>
    </div>
  );
};

export default Community;
