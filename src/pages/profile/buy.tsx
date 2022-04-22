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
  products: IProductWithEtc[];
}

const Kinds: NextPage = () => {
  const router = useRouter();

  const { data: responseOfProducts } =
    useSWR<IProductsResponse>("/api/users/me/buy");

  if (!responseOfProducts) return <Spinner kinds="page" />;

  return (
    <>
      <nav className="flex justify-between border-b">
        <Link href="/profile/sale">
          <a className="flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2">
            판매ㆍ예약 내역
          </a>
        </Link>
        <Link href="/profile/purchase">
          <a className="flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2">
            판매완료 내역
          </a>
        </Link>
        <Link href="/profile/buy">
          <a className="flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2 border-orange-500">
            구매 내역
          </a>
        </Link>
        <Link href="/profile/favorite">
          <a className="flex-1 text-center p-2 hover:text-orange-500 transition-colors border-b-2">
            관심 목록
          </a>
        </Link>
      </nav>
      <article className="flex flex-col divide-y-2">
        {/* 판매/구매/좋아요 상품 */}
        {responseOfProducts.products?.length > 0 ? (
          responseOfProducts.products.map((product, index) => (
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
            {router.query.kinds === "buy" && (
              <span className="block text-center text-2xl text-gray-400 py-4">
                판매완료한 상품이 없습니다.
              </span>
            )}
            {router.query.kinds === "favorite" && (
              <span className="block text-center text-2xl text-gray-400 py-4">
                좋아요를 누른 상품이 없습니다.
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
