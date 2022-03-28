import type { NextPage } from "next";
import useSWR from "swr";

// type
import { ICON_SHAPE, ApiResponse } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Item from "@src/components/common/Item";

// component
import SideButton from "@src/components/SideButton";
import Link from "next/link";

// hook
import useUser from "@src/libs/client/useUser";

interface ProductWithFavoriteCount extends Product {
  _count: {
    favorites: number;
  };
}

interface IProductsResponse extends ApiResponse {
  products: ProductWithFavoriteCount[];
}

const Home: NextPage = () => {
  const {} = useUser();
  const { data } = useSWR<IProductsResponse>("/api/products");

  return (
    <div className="flex flex-col space-y-5 divide-y">
      {data?.products?.map((product) => (
        <Item
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          favoriteCount={product._count.favorites}
        />
      ))}
      <Link href="/products/upload">
        <a>
          <SideButton>
            <Icon shape={ICON_SHAPE.PLUS} />
          </SideButton>
        </a>
      </Link>
    </div>
  );
};

export default Home;
