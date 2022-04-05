import React from "react";
import type { NextPage } from "next";
import useSWR from "swr";

// type
import { ApiResponse, ICON_SHAPE, SimpleUser } from "@src/types";
import { Product } from "@prisma/client";

// component
import Item from "@src/components/common/Item";
import Icon from "@src/components/common/Icon";
import SideButton from "@src/components/common/SideButton";
import { useRouter } from "next/router";

interface IProductWithWriter extends Product {
  records: SimpleUser[];
}

interface ISoldResponse extends ApiResponse {
  products: {
    id: number;
    updatedAt: string;
    product: IProductWithWriter;
  }[];
}

const Kinds: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<ISoldResponse>(
    router.query.kinds ? `/api/users/me?kinds=${router.query.kinds}` : null
  );

  return (
    <article className="flex flex-col space-y-5">
      {data?.products.map((product) => (
        <Item
          key={product.id}
          id={product.product.id}
          name={product.product.name}
          description={product.product.description}
          price={product.product.price}
          favoriteUsers={product.product.records}
        />
      ))}
    </article>
  );
};

export default Kinds;
