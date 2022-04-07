import Link from "next/link";

// type
import { ICON_SHAPE, SimpleUser } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import Photo from "@src/components/common/Photo";

// util
import { priceWithCommas } from "@src/libs/client/util";

interface IProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  favoriteUsers: SimpleUser[];
  index: number;
}

const ProductItem = ({
  id,
  name,
  description,
  price,
  image,
  favoriteUsers,
  index,
}: IProps) => {
  return (
    <section>
      <Link href={`/products/${id}`}>
        <a className="hover:shadow-lg flex justify-between p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:rounded-sm">
          {/* 상품 이미지, 이름, 설명, 가격 */}
          <ul className="flex space-x-4 flex-1">
            {/* 이미지 */}
            <li className="overflow-hidden rounded-md">
              <Photo
                photo={image}
                className="w-20 h-20 duration-500"
                $cover
                $priority={index <= 6}
              />
            </li>

            {/* 이름, 설명, 가격 */}
            <li className="flex-1 flex flex-col pt-2">
              <h3 className="text-base font-semibold text-gray-900">{name}</h3>
              <span className="flex-1 w-3/5 text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                {description}
              </span>
              <span className="font-medium text-sm text-gray-900">
                {priceWithCommas(price)}원
              </span>
            </li>
          </ul>
          {/* 우측 좋아요와 댓글 개수 */}
          <ul className="flex items-end space-x-2">
            <li className="flex items-center space-x-0.5 text-gray-700 text-sm">
              <Icon shape={ICON_SHAPE.HEART} width={16} height={16} />
              <span>{favoriteUsers?.length}</span>
            </li>
            <li className="flex items-center space-x-0.5 text-gray-700 text-sm">
              <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
              <span>구현중</span>
            </li>
          </ul>
        </a>
      </Link>
    </section>
  );
};

export default ProductItem;
