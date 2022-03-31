import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import useSWR from "swr";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Item from "@src/components/common/Item";

// component
import SideButton from "@src/components/SideButton";
import Link from "next/link";
import Button from "@src/components/common/Button";
import { toast } from "react-toastify";

interface ProductWithFavoriteUsers extends Product {
  records: SimpleUser[];
}

interface IProductsResponse extends ApiResponse {
  products: ProductWithFavoriteUsers[];
}

const Home: NextPage = () => {
  const { data: productsData } = useSWR<IProductsResponse>("/api/products");
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState({ keyword: "", isFirst: true });
  const { data: searchProductsData, error: searchProductsError } =
    useSWR<IProductsResponse>(
      search.keyword ? `/api/products?keyword=${search.keyword}` : null
    );

  // 2022/04/01 - 키워드 검색 onchange이벤트 - by 1-blue
  const onChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    [setKeyword]
  );

  // 2022/04/01 - 키워드 검색 요청 - by 1-blue
  const onSumbitKeyowrd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearch({ keyword, isFirst: true });
    },
    [setSearch, keyword]
  );

  // 2022/04/01 - 키워드 검색 완료 시 실행 - by 1-blue
  useEffect(() => {
    if (searchProductsData?.ok && search.isFirst) {
      toast.success(
        `키워드가 "${keyword}"인 상품들을 ${searchProductsData.products.length}개 검색했습니다.`,
        { autoClose: 4000 }
      );
      setKeyword("");
      setSearch((prev) => ({ ...prev, isFirst: false }));
    }
  }, [searchProductsData, setKeyword, keyword, search]);

  return (
    <div className="flex flex-col space-y-5 divide-y">
      <form className="flex" onSubmit={onSumbitKeyowrd}>
        <input
          type="search"
          className="peer flex-1 rounded-l-md border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
          placeholder="🚀 키워드를 검색해보세요! 🚀"
          onChange={onChangeKeyword}
          value={keyword}
        />
        <Button
          type="submit"
          text={<Icon shape={ICON_SHAPE.SEARCH} />}
          className="peer-focus:ring-1 bg-orange-400 px-3 text-white rounded-r-md ring-orange-400 hover:bg-orange-500"
          $loading={
            !!search.keyword &&
            search.isFirst &&
            !searchProductsData &&
            !searchProductsError
          }
        />
      </form>

      {searchProductsData?.products
        ? searchProductsData.products.map((product) => (
            <Item
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              favoriteUsers={product.records}
            />
          ))
        : productsData?.products?.map((product) => (
            <Item
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              favoriteUsers={product.records}
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
