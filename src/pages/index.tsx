import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Item from "@src/components/common/Item";
import Button from "@src/components/common/Button";
import Pagination from "@src/components/common/Pagination";
import SideButton from "@src/components/common/SideButton";

// hook
import usePagination from "@src/libs/hooks/usePagination";

interface ProductWithFavoriteUsers extends Product {
  records: SimpleUser[];
}

interface IResponseOfProducts extends ApiResponse {
  products: ProductWithFavoriteUsers[];
  productCount: number;
}

const Home: NextPage = () => {
  // 2022/04/05 - 전체 상품 요청 - by 1-blue
  const [{ data: responseOfProducts }, { page, setPage }, { offset }] =
    usePagination<IResponseOfProducts>("/api/products", {});

  // 2022/04/05 - 검색 상품 요청 - by 1-blue
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState({ keyword: "", isFirst: true });
  const [
    { data: responseOfSearchProducts, error: responseOfSearchProductsError },
  ] = usePagination<IResponseOfProducts>(
    search.keyword ? `/api/products?keyword=${search.keyword}` : null,
    {}
  );

  // 2022/04/01 - 키워드 검색 onchange이벤트 - by 1-blue
  const onChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    [setKeyword]
  );

  // 2022/04/01 - 키워드를 이용한 상품 검색 요청 - by 1-blue
  const onSumbitKeyowrd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearch({ keyword, isFirst: true });
      setPage(1);
    },
    [setSearch, keyword, setPage]
  );

  // 2022/04/01 - 키워드 검색 완료 시 실행 - by 1-blue
  useEffect(() => {
    if (responseOfSearchProducts?.ok && search.isFirst) {
      toast.success(
        `키워드가 "${keyword}"인 상품들을 ${responseOfSearchProducts.productCount}개 검색했습니다.`,
        { autoClose: 4000 }
      );
      setKeyword("");
      setSearch((prev) => ({ ...prev, isFirst: false }));
    }
  }, [responseOfSearchProducts, setKeyword, keyword, search]);
  // space-y-5 divide-y
  return (
    <>
      <article className="flex flex-col divide-y">
        {/* 상품 검색 폼 */}
        <section>
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
              className="peer-focus:ring-1 bg-orange-400 px-3 text-white rounded-r-md ring-orange-400 hover:bg-orange-500 focus:outline-orange-500"
              $loading={
                !!search.keyword &&
                search.isFirst &&
                !responseOfSearchProducts &&
                !responseOfSearchProductsError
              }
            />
          </form>
        </section>

        {/* 상품 리스트 */}
        <div className="mt-4" />
        {responseOfSearchProducts?.products
          ? responseOfSearchProducts.products.map((product) => (
              <Item
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                favoriteUsers={product.records}
              />
            ))
          : responseOfProducts?.products?.map((product) => (
              <Item
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                favoriteUsers={product.records}
              />
            ))}
        <div />
      </article>

      {/* 페이지네이션 컴포넌트 */}
      <Pagination
        url={
          search.keyword
            ? `/api/products?keyword=${search.keyword}`
            : "/api/products"
        }
        page={page}
        offset={offset}
        setPage={setPage}
        max={
          responseOfSearchProducts?.products
            ? Math.ceil(
                (responseOfSearchProducts?.productCount as number) / offset
              )
            : Math.ceil((responseOfProducts?.productCount as number) / offset)
        }
      />

      {/* 상품 업로드 버튼 */}
      <SideButton
        url="/products/upload"
        contents={<Icon shape={ICON_SHAPE.PLUS} />}
      />
    </>
  );
};

export default Home;
