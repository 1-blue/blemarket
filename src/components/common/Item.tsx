import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

interface IProps {
  id: number;
  name: string;
  description: string;
  price: number;
  favoriteCount: number;
}

const Item = ({ id, name, description, price, favoriteCount }: IProps) => {
  return (
    <Link href={`products/${id}`}>
      <a className="flex justify-between px-4 pt-4 first:pt-0">
        <div className="flex space-x-4 flex-1">
          {/* 이미지 */}
          <div className="w-20 h-20 bg-gray-400 rounded-md" />
          {/* 이름, 설명, 가격 */}
          <div className="flex-1 flex flex-col pt-2">
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            <span className="flex-1 w-3/5 text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
              {description}
            </span>
            <span className="font-medium text-sm text-gray-900">{price}원</span>
          </div>
        </div>
        <div className="flex items-end space-x-2">
          {/* 좋아요  개수 */}
          <div className="flex items-center space-x-0.5 text-gray-700 text-sm">
            <Icon shape={ICON_SHAPE.HEART} width={16} height={16} />
            <span>{favoriteCount}</span>
          </div>
          {/* 댓글 개수 */}
          <div className="flex items-center space-x-0.5 text-gray-700 text-sm">
            <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
            <span>1</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Item;
