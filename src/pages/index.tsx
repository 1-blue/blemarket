import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Link from "next/link";

// type
import { ICON_SHAPE, ApiResponse } from "@src/types";
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
import { combineClassNames } from "@src/libs/client/util";

interface ProductWithEtc extends Product {
  _count: {
    answers: number;
    records: number;
  };
  records: {
    kinds: "Sale" | "Favorite" | "Reserved" | "Purchase";
  }[];
}
interface IResponseOfProducts extends ApiResponse {
  products: ProductWithEtc[];
  productCount: number;
}
type KeywordForm = {
  keyword: string;
};
type filterForm = {
  reserved: boolean;
  purchase: boolean;
};
interface IResponseOfRecommendKeywords extends ApiResponse {
  keywords: {
    keyword: string;
  }[];
}

const Home: NextPage<IResponseOfProducts> = (props) => {
  const router = useRouter();

  // 2022/04/23 - 필터링 form - by 1-blue
  const { register: filterRegister, watch: filterWatch } =
    useForm<filterForm>();

  // 2022/04/05 - 전체 상품 요청 - by 1-blue
  const [{ data: responseOfProducts }, { page, setPage }, { offset }] =
    usePagination<IResponseOfProducts>(
      `/api/products?reserved=${filterWatch("reserved") ? "1" : "0"}&purchase=${
        filterWatch("purchase") ? "1" : "0"
      }`,
      {}
    );
  const [
    { data: responseOfSearchProducts, error: responseOfSearchProductsError },
  ] = usePagination<IResponseOfProducts>(
    router.query.keyword
      ? `/api/products?keyword=${router.query.keyword}&reserved=${
          filterWatch("reserved") ? "1" : "0"
        }&purchase=${filterWatch("purchase") ? "1" : "0"}`
      : null,
    {}
  );

  // 2022/04/13 - 키워드 form - by 1-blue
  const { handleSubmit, register, reset, watch } = useForm<KeywordForm>();
  // 2022/04/01 - 키워드를 이용한 상품 검색 요청 - by 1-blue
  const onSearchKeyword = useCallback(
    (body: KeywordForm) => router.push(`?keyword=${body.keyword}`),
    [router]
  );
  // 2022/04/01 - 키워드 검색 완료 시 실행 - by 1-blue
  useEffect(() => {
    if (responseOfSearchProducts?.ok && router.query.keyword) {
      toast.success(
        `키워드가 "${router.query.keyword}"인 상품들을 ${responseOfSearchProducts.productCount}개 검색했습니다.`
      );
      reset();
    }
  }, [responseOfSearchProducts, reset, router]);

  // 2022/04/08 - 랜더링할 상품들 - by 1-blue
  const [targetProducts, setTargetProducts] = useState(props);

  // 2022/04/08 - 최신 상품으로 업데이트 - by 1-blue
  useEffect(() => {
    if (responseOfSearchProducts && router.query?.keyword)
      return setTargetProducts(responseOfSearchProducts);
    if (responseOfProducts) return setTargetProducts(responseOfProducts);
  }, [router, responseOfSearchProducts, responseOfProducts, setTargetProducts]);

  // 2022/04/13 - SEO - by 1-blue
  const photo = targetProducts?.products?.filter((product) =>
    product.image ? product.image : null
  );

  // 2022/04/16 - 키워드 값 - by 1-blue
  const keyword = watch("keyword");
  // 2022/04/16 - 키워드 포커스 여부 및 관련 키워드 보여줄지 결정할 변수 - by 1-blue
  const [isFocus, setIsFocus] = useState(false);
  // 2022/04/16 - 키워드 검색 시 디바운스 적용할 때 사용하는 변수 - by 1-blue
  const [debounce, setDebounce] = useState(false);
  // 2022/04/16 - 키워드 검색 시 디바운스 적용할 때 사용하는 함수 - by 1-blue
  const debounceKeyword = useCallback(() => setDebounce(true), [setDebounce]);
  // 2022/04/16 - 키워드 검색 시 디바운스 적용 - by 1-blue
  useEffect(() => {
    const timerId = setTimeout(debounceKeyword, 300);

    return () => {
      clearTimeout(timerId);
      setDebounce(false);
    };
  }, [debounceKeyword, keyword, setDebounce]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 2022/04/16 - 영역외 클릭 시 추천 키워드 창 닫기 - by 1-blue
  const handleCloseModal = useCallback(
    (e: any) => {
      if (
        isFocus &&
        (!wrapperRef.current || !wrapperRef.current.contains(e.target))
      )
        setIsFocus(false);
    },
    [isFocus, setIsFocus, wrapperRef]
  );
  // 2022/04/16 - 추천 키워드 창 닫기 이벤트 등록 - by 1-blue
  useEffect(() => {
    setTimeout(() => window.addEventListener("click", handleCloseModal), 0);
    return () => window.removeEventListener("click", handleCloseModal);
  }, [handleCloseModal]);
  // 2022/04/16 - 추천 키워드 패치 - by 1-blue
  const { data: recommendKeywords, isValidating } =
    useSWR<IResponseOfRecommendKeywords>(
      debounce && keyword ? `/api/keyword/${keyword}` : null
    );

  return (
    <>
      <HeadInfo
        title="blemarket | Home"
        description="blemarket의 상품 목록 페이지입니다. 😄"
        photo={
          targetProducts.productCount > 0 && photo?.[0]?.image
            ? photo[0].image
            : null
        }
      />

      {/* 상품 검색 폼과 추천 키워드 */}
      <div className="relative border-b-2 pb-4" ref={wrapperRef}>
        <form className="flex" onSubmit={handleSubmit(onSearchKeyword)}>
          <input
            type="search"
            className={combineClassNames(
              "peer flex-1 rounded-l-md border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400",
              recommendKeywords ? "rounded-lr-md rounded-b-none" : ""
            )}
            placeholder="🚀 키워드를 검색해보세요! 🚀"
            {...register("keyword")}
            onFocus={() => setIsFocus(true)}
          />
          <Button
            type="submit"
            text={<Icon shape={ICON_SHAPE.SEARCH} />}
            className={combineClassNames(
              "peer-focus:ring-1 bg-orange-400 px-3 text-white rounded-r-md ring-orange-400 hover:bg-orange-500 focus:outline-orange-500",
              recommendKeywords ? "rounded-lr-md rounded-b-none" : ""
            )}
            $loading={
              !!router.query.keyword &&
              !responseOfSearchProducts &&
              !responseOfSearchProductsError
            }
            tabIndex={-1}
          />
        </form>
        {isFocus &&
          (recommendKeywords && recommendKeywords.keywords.length > 0 ? (
            <ul className="absolute top-[43px] w-full rounded-b-md overflow-hidden z-10">
              {recommendKeywords.keywords.map(({ keyword }) => (
                <li key={keyword}>
                  <Link href={`/?keyword=${keyword}`}>
                    <a className="group flex items-center p-4 bg-slate-200 space-x-4 hover:bg-orange-100 transition-colors focus:outline-none focus:bg-orange-100 focus:text-orange-500">
                      <Icon
                        shape={ICON_SHAPE.SEARCH}
                        width={20}
                        height={20}
                        className="group-hover:text-orange-400 transition-colors"
                      />
                      <span className="group-hover:text-orange-400 transition-colors">
                        {keyword}
                      </span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="absolute  top-[43px] w-full rounded-b-md overflow-hidden z-10">
              <span className="block bg-slate-200 p-4">
                {isValidating
                  ? "키워드를 검색중입니다..."
                  : "⁉️ 추천 검색어가 없습니다."}
              </span>
            </div>
          ))}
      </div>

      {/* 상품 필터 */}
      <article className="border-b-2 p-4">
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reserved"
              {...filterRegister("reserved")}
              className="cursor-pointer"
            />
            <label htmlFor="reserved" className="cursor-pointer">
              예약 상품 제외
            </label>
          </li>
          <li className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="purchase"
              {...filterRegister("purchase")}
              className="cursor-pointer"
            />
            <label htmlFor="purchase" className="cursor-pointer">
              판매 완료 상품 제외
            </label>
          </li>
        </ul>
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
            records={product?.records}
          />
        ))}
        <div />
      </article>

      {/* 페이지네이션 컴포넌트 */}
      <article>
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
      </article>

      {/* 상품 업로드 버튼 */}
      <SideButton
        url="/products/upload"
        contents={<Icon shape={ICON_SHAPE.PLUS} />}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const productsPromise = await prisma.product.findMany({
    take: 10,
    skip: 0,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  const productCountPromise = await prisma.product.count();

  const [products, productCount] = await Promise.all([
    productsPromise,
    productCountPromise,
  ]);

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
