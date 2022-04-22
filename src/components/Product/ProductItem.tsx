import { useCallback, useEffect } from "react";
import Link from "next/link";
import { KeyedMutator } from "swr";
import { toast } from "react-toastify";

// type
import { ApiResponse, ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import Photo from "@src/components/common/Photo";
import Button from "@src/components/common/Button";

// util
import { priceWithCommas } from "@src/libs/client/util";

// hook
import useMutation from "@src/libs/hooks/useMutation";

interface IProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  count?: {
    answers: number;
    records: number;
  };
  index: number;
  records?: {
    kinds: "Sale" | "Purchase" | "Reserved" | "Favorite";
  }[];
  productsMutate?: KeyedMutator<any>;
  $owner?: boolean;
}

const ProductItem = ({
  id,
  name,
  description,
  price,
  image,
  count,
  index,
  records,
  productsMutate,
  $owner,
}: IProps) => {
  // 2022/04/21 - 상품의 상태 변경 관련 변수 및 메서드 - by 1-blue
  const [
    changeKinds,
    { data: changeKindsResponse, loading: changeKindsLoading },
  ] = useMutation<ApiResponse>(`/api/products/${id}/kinds`, "PATCH");
  // 2022/04/21 - 상품의 상태 변경 - by 1-blue
  const onChangeKinds = useCallback(
    (state: "Sale" | "Purchase" | "Reserved" | "Favorite") => () =>
      changeKinds({ currentKinds: records?.[0].kinds, afterKinds: state }),
    [changeKinds, records]
  );
  // 2022/04/21 - 상품의 상태 변경 완료 - by 1-blue
  useEffect(() => {
    if (changeKindsResponse?.ok) {
      toast.success(changeKindsResponse.message);
      productsMutate?.(true);
    }
  }, [changeKindsResponse, productsMutate]);
  // 2022/04/21 - 상품의 종류들 ( 판매, 예약, 구매 등 ) - by 1-blue
  const kindsList = records?.map((v) => v.kinds);

  return (
    <>
      <section>
        <Link href={`/products/${id}`}>
          <a className="flex justify-between p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:rounded-sm hover:bg-slate-200 transition-colors">
            {/* 상품 이미지, 이름, 설명, 가격 */}
            <ul className="flex space-x-4 flex-1">
              <li className="overflow-hidden rounded-md">
                <Photo
                  photo={image}
                  className="w-20 h-20 duration-500"
                  $cover
                  $priority={index <= 6}
                />
              </li>
              <li className="flex-1 flex flex-col pt-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {name}
                </h3>
                <span className="flex-1 w-3/5 text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                  {description}
                </span>
                <span className="font-medium text-sm text-gray-900">
                  {priceWithCommas(price)}원
                </span>
              </li>
            </ul>
            {/* 우측 좋아요와 댓글 개수 */}
            <ul className="flex flex-col items-end">
              <div className="flex space-x-2">
                {kindsList?.includes("Reserved") && (
                  <li>
                    <span className="bg-orange-500 text-white p-2 rounded-md text-xs">
                      예약중
                    </span>
                  </li>
                )}
                {kindsList?.includes("Purchase") && (
                  <li>
                    <span className="bg-indigo-500 text-white p-2 rounded-md text-xs">
                      판매완료
                    </span>
                  </li>
                )}
              </div>
              <div className="flex-1" />
              <div className="flex space-x-2">
                <li className="flex items-center space-x-0.5 text-gray-700 text-sm">
                  <Icon shape={ICON_SHAPE.HEART} width={16} height={16} />
                  {/*
                    1을 빼주는 이유는 records라는 enum으로 좋아요, 예약, 판매, 구매 등의 상태를 공유해서 사용하기 때문에
                    records의 count에는 판매/예약/구매 중 하나의 상태 + 좋아요들을 가지고 있기 때문에 좋아요 개수만 세기 위해 하나를 빼줌
                  */}
                  <span>{count?.records! - 1}</span>
                </li>
                <li className="flex items-center space-x-0.5 text-gray-700 text-sm">
                  <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
                  <span>{count?.answers}</span>
                </li>
              </div>
            </ul>
          </a>
        </Link>
      </section>
      {/* 판매중인 상품 */}
      {$owner && kindsList?.includes("Sale") && (
        <section className="flex divide-x justify-between border-y">
          <Button
            type="button"
            className="flex-1 text-center py-2 hover:bg-orange-200 hover:text-orange-500 transition-colors"
            onClick={onChangeKinds("Reserved")}
            text="예약중으로 변경"
            $loading={changeKindsLoading}
          />
          <Link
            href={`/profile/complete?productId=${id}&currentKinds=${records?.[0].kinds}`}
          >
            <a className="flex-1 text-center py-2 hover:bg-orange-100 hover:text-orange-500 transition-colors">
              거래완료로 변경
            </a>
          </Link>
        </section>
      )}
      {/* 예약된 상품 */}
      {$owner && kindsList?.includes("Reserved") && (
        <section className="flex divide-x justify-between border-y">
          <Button
            type="button"
            className="flex-1 text-center py-2 hover:bg-orange-100 hover:text-orange-500 transition-colors"
            onClick={onChangeKinds("Sale")}
            text="판매중으로 변경"
            $loading={changeKindsLoading}
          />
          <Link
            href={`/profile/complete?productId=${id}&currentKinds=${records?.[0].kinds}`}
          >
            <a className="flex-1 text-center py-2 hover:bg-orange-100 hover:text-orange-500 transition-colors">
              거래완료로 변경
            </a>
          </Link>
        </section>
      )}
    </>
  );
};

export default ProductItem;
