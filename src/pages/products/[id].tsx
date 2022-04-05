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
import { combineClassNames, priceWithCommas } from "@src/libs/client/util";
import { dateFormat } from "@src/libs/client/dateFormat";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Profile from "@src/components/common/Profile";

// hook
import useMutation from "@src/libs/hooks/useMutation";

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

  // 상품 상세 정보
  const { data: responseOfProduct, mutate } = useSWR<IProductWithEtcResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  // 좋아요 추가 요청 메서드
  const [addFavorite, { loading: addLoading }] = useMutation<ApiResponse>(
    `/api/products/${responseOfProduct?.product.id}/favorite`
  );
  // 좋아요 제거 요청 메서드
  const [removeFavorite, { loading: removeLoading }] = useMutation<ApiResponse>(
    `/api/products/${responseOfProduct?.product.id}/favorite`,
    "DELETE"
  );

  // 2022/03/26 - 좋아요 토글 이벤트 - by 1-blue
  const onClickFavorite = useCallback(() => {
    if (addLoading) return toast.error("이미 좋아요 추가 처리중입니다.");
    if (removeLoading) return toast.error("이미 좋아요 제거 처리중입니다.");

    mutate((prev) => prev && { ...prev, isFavorite: !prev.isFavorite }, false);

    if (responseOfProduct?.isFavorite) removeFavorite(null);
    else addFavorite(null);
  }, [
    addLoading,
    removeLoading,
    mutate,
    responseOfProduct,
    addFavorite,
    removeFavorite,
  ]);

  return (
    <>
      {/* 상품 이미지, 유저 프로필, 이름, 설명, 가격, 키워드, 좋아요 */}
      <article className="px-4 pb-8 mb-8 border-b">
        <section className="h-96 w-full bg-slate-300" />
        <section>
          <Profile user={responseOfProduct?.product.user!} />
        </section>
        <section className="flex flex-col space-y-3">
          <h2 className="font-bold text-3xl">
            {responseOfProduct?.product.name}
          </h2>
          <p className="text-gray-900 p-4 rounded-md bg-gray-200 whitespace-pre">
            {responseOfProduct?.product.description}
          </p>
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-lg">
              {priceWithCommas(responseOfProduct?.product.price!)}원
            </span>
            <span className="font-semibold text-xs">
              ({" "}
              {dateFormat(
                responseOfProduct?.product.updatedAt!,
                "YYYY/MM/DD hh:mm:ss"
              )}{" "}
              )
            </span>
          </div>
          <ul className="flex space-x-2 mb-4 flex-wrap">
            {responseOfProduct?.product.keywords.split(" ").map((keyword) => (
              <li
                key={keyword}
                className="p-2 bg-slate-200 rounded-lg text-orange-400 font-semibold text-sm cursor-pointer"
              >
                <Link href={`/?keyword=${keyword}`}>
                  <a>{keyword}</a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-between space-x-2">
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
                responseOfProduct?.isFavorite
                  ? "bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-500"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 focus:ring-gray-500"
              )}
              text={
                <Icon
                  shape={ICON_SHAPE.HEART}
                  $fill={!!responseOfProduct?.isFavorite}
                />
              }
            />
          </div>
        </section>
      </article>

      {/* 유사 상품들 */}
      <article className="px-4">
        <h3 className="font-bold text-2xl mb-6">유사한 상품들</h3>
        <ul className="grid grid-cols-2 gap-4">
          {responseOfProduct?.relatedProducts.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>
                <a>
                  <div className="h-56 w-full bg-slate-300 mb-2" />
                  <h3 className="text-gray-700">{product.name}</h3>
                  <p className="text-gray-900 font-semibold">
                    {product.price}원
                  </p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default ProductsDatail;
