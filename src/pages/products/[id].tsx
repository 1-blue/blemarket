import React, { useCallback } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Product } from "@prisma/client";

// util
import { combineClassNames } from "@src/libs/client/util";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Profile from "@src/components/common/Profile";
import useMutation from "@src/libs/client/useMutation";

interface IProductWithUser extends Product {
  user: SimpleUser;
}

interface IProductWithEtcResponse extends ApiResponse {
  product: IProductWithUser;
  relatedProducts: Product[];
  isFavorite: boolean;
}

const ProductsDatail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<IProductWithEtcResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [addFavorite, { loading: addLoading }] = useMutation<ApiResponse>(
    `/api/products/${data?.product.id}/favorite`
  );
  const [removeFavorite, { loading: removeLoading }] = useMutation<ApiResponse>(
    `/api/products/${data?.product.id}/favorite`,
    "DELETE"
  );

  // 2022/03/26 - 좋아요 토글 이벤트 - by 1-blue
  const onClickFavorite = useCallback(() => {
    if (addLoading) return toast.error("이미 좋아요 추가 처리중입니다.");
    if (removeLoading) return toast.error("이미 좋아요 제거 처리중입니다.");

    mutate((prev) => prev && { ...prev, isFavorite: !prev.isFavorite }, false);

    if (data?.isFavorite) removeFavorite(null);
    else addFavorite(null);
  }, [addLoading, removeLoading, mutate, data, addFavorite, removeFavorite]);

  return (
    <>
      {/* >> 로딩 스피너 추가 */}
      <div className="px-4 pb-8 mb-8 border-b">
        {/* 상품 이미지 */}
        <div className="h-96 w-full bg-slate-300" />
        {/* 게시글 작성자 프사, 이름 */}
        <Profile
          id={data?.product.user.id}
          name={data?.product.user.name}
          avatar={data?.product.user.avatar}
        />
        {/* 상품 이름, 가격, 설명, 채팅, 좋아요 */}
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl mb-1">{data?.product.name}</h1>
          <p className="font-semibold text-xl mb-4">{data?.product.price}원</p>
          <p className="text-gray-900 mb-4 whitespace-pre">
            {data?.product.description}
          </p>
          <div className="flex justify-between space-x-2  ">
            <Button
              text="Talk to seller"
              type="button"
              className="flex-1"
              $primary
            />
            <Button
              onClick={onClickFavorite}
              className={combineClassNames(
                "p-3 rounded-md focus:outline-none focus:ring-2",
                data?.isFavorite
                  ? "bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-500"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 focus:ring-gray-500"
              )}
              text={
                <Icon shape={ICON_SHAPE.HEART} $fill={!!data?.isFavorite} />
              }
            />
          </div>
        </div>
      </div>
      <div className="px-4">
        <h2 className="font-bold text-2xl mb-6">Similar items</h2>
        <div className="grid grid-cols-2 gap-4">
          {data?.relatedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <a>
                <div className="h-56 w-full bg-slate-300 mb-2" />
                <h3 className="text-gray-700">{product.name}</h3>
                <p className="text-gray-900 font-semibold">{product.price}원</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsDatail;
