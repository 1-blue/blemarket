import React, { useCallback, useEffect, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Pagination from "@src/components/common/Pagination";
import SideButton from "@src/components/common/SideButton";
import HeadInfo from "@src/components/common/HeadInfo";

// component
import ProductItem from "@src/components/Product/ProductItem";

// hook
import usePagination from "@src/libs/hooks/usePagination";

// util
import prisma from "@src/libs/client/prisma";

interface ProductWithCount extends Product {
  _count: {
    answers: number;
    records: number;
  };
}

interface IResponseOfProducts extends ApiResponse {
  products: ProductWithCount[];
  productCount: number;
}

const Home: NextPage<IResponseOfProducts> = (props) => {
  const router = useRouter();
  // 2022/04/05 - 전체 상품 요청 - by 1-blue
  const [{ data: responseOfProducts }, { page, setPage }, { offset }] =
    usePagination<IResponseOfProducts>("/api/products", {});
  const [
    { data: responseOfSearchProducts, error: responseOfSearchProductsError },
  ] = usePagination<IResponseOfProducts>(
    router.query.keyword
      ? `/api/products?keyword=${router.query.keyword}`
      : null,
    {}
  );

  // 2022/04/05 - 검색 상품 요청 - by 1-blue
  const [keyword, setKeyword] = useState("");
  // 2022/04/01 - 키워드 검색 onchange이벤트 - by 1-blue
  const onChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    [setKeyword]
  );
  // 2022/04/01 - 키워드를 이용한 상품 검색 요청 - by 1-blue
  const onSumbitKeyowrd = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(`?keyword=${keyword}`);
    },
    [keyword, router]
  );
  // 2022/04/01 - 키워드 검색 완료 시 실행 - by 1-blue
  useEffect(() => {
    if (responseOfSearchProducts?.ok && router.query.keyword) {
      toast.success(
        `키워드가 "${router.query.keyword}"인 상품들을 ${responseOfSearchProducts.productCount}개 검색했습니다.`,
        { autoClose: 4000 }
      );
      setKeyword("");
    }
  }, [responseOfSearchProducts, setKeyword, router]);

  // 2022/04/08 - 랜더링할 상품들 - by 1-blue
  const [targetProducts, setTargetProducts] = useState(props);

  // 2022/04/08 - 최신 상품으로 업데이트 - by 1-blue
  useEffect(() => {
    if (responseOfSearchProducts && router.query?.keyword)
      return setTargetProducts(responseOfSearchProducts);
    if (responseOfProducts) return setTargetProducts(responseOfProducts);
  }, [router, responseOfSearchProducts, responseOfProducts, setTargetProducts]);

  const photo = targetProducts?.products?.filter((product) =>
    product.image ? product.image : null
  );

  return (
    <>
      <HeadInfo
        title="blemarket | Home"
        description="blemarket의 상품 목록 페이지입니다. 😄"
        photo={
          targetProducts.productCount > 0 && photo?.[0].image
            ? photo[0].image
            : null
        }
      />

      {/* 상품 검색 폼 */}
      <article className="flex flex-col border-b-2 pb-4">
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
                !!router.query.keyword &&
                !responseOfSearchProducts &&
                !responseOfSearchProductsError
              }
            />
          </form>
        </section>
      </article>

      {/* 상품 리스트 */}
      <article className="divide-y-2">
        {targetProducts?.products?.map((product, index) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            count={product?._count}
            index={index}
          />
        ))}
        <div />
      </article>

      {/* 페이지네이션 컴포넌트 */}
      <Pagination
        url={
          router.query.keyword
            ? `/api/products?keyword=${router.query.keyword}`
            : "/api/products"
        }
        page={page}
        offset={offset}
        setPage={setPage}
        max={
          targetProducts?.products
            ? Math.ceil((targetProducts?.productCount as number) / offset)
            : Math.ceil((targetProducts?.productCount as number) / offset)
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

// 초기 렌더링 정보 미리 가져오기 ( /api/products?page=1&limit=10 )
export const getStaticProps: GetStaticProps = async () => {
  const products = await prisma.product.findMany({
    take: 10,
    skip: 0,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  const productCount = await prisma.product.count();

  return {
    props: {
      ok: true,
      message: "상품들의 첫 페이지를 가져왔습니다.",
      products: JSON.parse(JSON.stringify(products)),
      productCount,
    },
  };
};

export default Home;
