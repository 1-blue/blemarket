import React from "react";
import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

// type
import { ApiResponse, RECORD } from "@src/types";
import { KINDS, Product } from "@prisma/client";

// component
import ProductItem from "@src/components/Product/ProductItem";

// util
import { withSsrSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

interface IProductWithCount extends Product {
  _count: {
    answers: number;
    records: number;
  };
}

interface IProductsResponse extends ApiResponse {
  products: {
    id: number;
    updatedAt: string;
    product: IProductWithCount;
  }[];
}

const Kinds: NextPage<IProductsResponse> = ({ products }) => {
  const router = useRouter();

  return (
    <article className="flex flex-col space-y-5">
      {products.length > 0 ? (
        products.map((product, index) => (
          <ProductItem
            key={product.id}
            id={product.product.id}
            name={product.product.name}
            description={product.product.description}
            price={product.product.price}
            count={product.product._count}
            image={product.product.image}
            index={index}
          />
        ))
      ) : (
        <>
          {router.query.kinds === "sale" && (
            <span className="block text-center text-2xl text-gray-400 mt-4">
              판매한 상품이 없습니다.
            </span>
          )}
          {router.query.kinds === "purchase" && (
            <span className="block text-center text-2xl text-gray-400 mt-4">
              구매한 상품이 없습니다.
            </span>
          )}
          {router.query.kinds === "favorite" && (
            <span className="block text-center text-2xl text-gray-400 mt-4">
              좋아요를 누른 상품이 없습니다.
            </span>
          )}
        </>
      )}
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    const kinds = context.query?.kinds;
    const userId = +context.req?.session.user?.id!;

    let where = null;

    switch (kinds) {
      case RECORD.FAVORITE:
        where = {
          userId,
          kinds: KINDS.Favorite,
        };
        break;
      case RECORD.SALE:
        where = {
          userId,
          kinds: KINDS.Sale,
        };
        break;
      case RECORD.PURCHASE:
        where = {
          userId,
          kinds: KINDS.Purchase,
        };
        break;
      default:
        return;
    }

    const exProducts = await prisma.record.findMany({
      where,
      select: {
        id: true,
        updatedAt: true,
        product: {
          include: {
            _count: {
              select: {
                answers: true,
                records: true,
              },
            },
          },
        },
      },
    });

    return {
      props: {
        ok: true,
        message: "특정 상품들에 대한 정보입니다.",
        products: JSON.parse(JSON.stringify(exProducts)),
      },
    };
  }
);

export default Kinds;
