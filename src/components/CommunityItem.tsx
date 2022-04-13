import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";
import { IPostWithEtc } from "@src/pages/community";

// common-component
import Icon from "@src/components/common/Icon";

// util
import { dateFormat } from "@src/libs/client/dateFormat";

const CommunityItem = ({ post }: { post: IPostWithEtc }) => {
  return (
    <li>
      <span className="inline-block bg-gray-200 px-2 py-1 rounded-full text-xs mb-1">
        동네질문
      </span>
      <Link href={`/community/${post.id}`}>
        <a className="focus:outline-orange-500">
          <div className="flex items-baseline mb-2 ">
            <span className="text-orange-500 font-semibold mr-2">Q.</span>
            <span className="inline-block w-4/5 overflow-hidden text-ellipsis whitespace-nowrap">
              {post.question}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">{post.user.name}</span>
            <span className="text-gray-500 text-sm font-semibold">
              {dateFormat(post.updatedAt, "YYYY/MM/DD")}
            </span>
          </div>
          <div className="flex py-2 border-y border-b-2 space-x-4">
            <span className="flex items-center space-x-1">
              <Icon shape={ICON_SHAPE.CHECK} width={16} height={16} />
              <span>궁금해요 {post._count.recommendations}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
              <span>답변 {post._count.answers}</span>
            </span>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default CommunityItem;
