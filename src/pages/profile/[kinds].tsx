import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";

// type
import { ApiResponse } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Spinner from "@src/components/common/Spinner";

// component
import ProductItem from "@src/components/Product/ProductItem";

// util
import { combineClassNames } from "@src/libs/client/util";

// hook
import useMe from "@src/libs/hooks/useMe";

interface IProductWithEtc extends Product {
  _count: {
    answers: number;
    records: number;
  };
  records: {
    kinds: "Sale" | "Favorite" | "Reserved" | "Purchase";
  }[];
}
interface IProductsResponse extends ApiResponse {
  products: {
    id: number;
    updatedAt: string;
    product: IProductWithEtc;
  }[];
  reservedProducts?: {
    id: number;
    updatedAt: string;
    product: IProductWithEtc;
  }[];
}

const Kinds: NextPage = () => {
  const router = useRouter();
  const { me } = useMe();

  const { data: responseOfProducts, mutate: productsMutate } =
    useSWR<IProductsResponse>(
      router.query.kinds ? `/api/users/me/${router.query.kinds}` : null
    );

  if (!responseOfProducts) return <Spinner kinds="page" />;

  return (
    <>
      <nav className="flex justify-between border-b">
        <Link href="/profile/sale">
          <a
            className={combineClassNames(
              "flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2",
              router.query.kinds === "sale" ? "border-orange-500" : ""
            )}
          >
            판매ㆍ예약 내역
          </a>
        </Link>
        <Link href="/profile/purchase">
          <a
            className={combineClassNames(
              "flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2",
              router.query.kinds === "purchase" ? "border-orange-500" : ""
            )}
          >
            구매 내역
          </a>
        </Link>
        <Link href="/profile/favorite">
          <a
            className={combineClassNames(
              "flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2",
              router.query.kinds === "favorite" ? "border-orange-500" : ""
            )}
          >
            관심 목록
          </a>
        </Link>
      </nav>
      <article className="flex flex-col divide-y-2">
        {/* 판매/구매/좋아요 상품 */}
        {responseOfProducts.products?.length > 0 ? (
          responseOfProducts.products.map(({ product }, index) => (
            <ProductItem
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              count={product._count}
              image={product.image}
              index={index}
              records={product.records}
              productsMutate={productsMutate}
              $owner={product.userId === me?.id}
            />
          ))
        ) : (
          <>
            {router.query.kinds === "sale" && (
              <span className="block text-center text-2xl text-gray-400 py-4">
                판매중인 상품이 없습니다.
              </span>
            )}
            {router.query.kinds === "purchase" && (
              <span className="block text-center text-2xl text-gray-400 py-4">
                구매한 상품이 없습니다.
              </span>
            )}
            {router.query.kinds === "favorite" && (
              <span className="block text-center text-2xl text-gray-400 py-4">
                좋아요를 누른 상품이 없습니다.
              </span>
            )}
          </>
        )}

        {/* 예약 상품 */}
        {responseOfProducts.reservedProducts &&
        responseOfProducts.reservedProducts?.length > 0 ? (
          responseOfProducts.reservedProducts?.map(({ product }, index) => (
            <ProductItem
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              count={product._count}
              image={product.image}
              index={index}
              records={product.records}
              productsMutate={productsMutate}
              $owner
            />
          ))
        ) : (
          <>
            {router.query.kinds === "sale" && (
              <span className="block text-center text-2xl text-gray-400 py-4">
                판매 예약 중인 상품이 없습니다.
              </span>
            )}
          </>
        )}
        <div />
      </article>
    </>
  );
};

export default Kinds;
