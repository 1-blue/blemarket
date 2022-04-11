import React from "react";
import type { GetServerSideProps, NextPage, NextPageContext } from "next";

// type
import { ApiResponse, RECORD, SimpleUser } from "@src/types";
import { KINDS, Product } from "@prisma/client";

// component
import ProductItem from "@src/components/Product/ProductItem";

// util
import { withSsrSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

interface IProductWithWriter extends Product {
  records: SimpleUser[];
}

interface IProductsResponse extends ApiResponse {
  products: {
    id: number;
    updatedAt: string;
    product: IProductWithWriter;
  }[];
}

const Kinds: NextPage<IProductsResponse> = ({ products }) => {
  return (
    <article className="flex flex-col space-y-5">
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          id={product.product.id}
          name={product.product.name}
          description={product.product.description}
          price={product.product.price}
          favoriteUsers={product.product.records}
          image={product.product.image}
          index={index}
        />
      ))}
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    const kinds = context.query?.kinds;
    const userId = context.req?.session.user?.id;

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
            records: {
              where: {
                kinds: "Favorite",
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
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
