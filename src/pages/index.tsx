import type { NextPage } from "next";
import useSWR from "swr";

// type
import { ICON_SHAPE, IMutationResult } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";

// component
import SideButton from "@src/components/SideButton";
import Link from "next/link";

// hook
import useUser from "@src/libs/client/useUser";
import Item from "@src/components/common/Item";

interface IProductsResponse extends IMutationResult {
  products?: Product[];
}

const Home: NextPage = () => {
  const {} = useUser("/api/users/me");
  const { data } = useSWR<IProductsResponse>("/api/products");

  return (
    <div className="flex flex-col space-y-5 divide-y">
      {/* >> 여기서 데이터 가져오는 동안 스피너 보여주기! */}
      {data?.products?.map((product) => (
        <Item key={product.id} item={product} />
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
