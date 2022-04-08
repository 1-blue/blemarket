import React, { useCallback } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Product } from "@prisma/client";

// util
import { combineClassNames, priceWithCommas } from "@src/libs/client/util";
import { dateFormat } from "@src/libs/client/dateFormat";
import prisma from "@src/libs/client/prisma";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Profile from "@src/components/common/Profile";
import Photo from "@src/components/common/Photo";
import HeadInfo from "@src/components/common/HeadInfo";

// hook
import useMutation from "@src/libs/hooks/useMutation";

interface IProductWithUser extends Product {
  user: SimpleUser;
}

interface IProductWithEtcResponse extends ApiResponse {
  product: IProductWithUser;
  relatedProducts: Product[];
}

interface IFavoriteResponse extends ApiResponse {
  isFavorite: boolean;
  favoriteCount: number;
}

const ProductsDatail: NextPage<IProductWithEtcResponse> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();

  // 게시글의 좋아요 정보
  const { data: favoriteResponse, mutate: favoriteMutate } =
    useSWR<IFavoriteResponse>(
      router.query.id ? `/api/products/${router.query.id}/favorite` : null
    );
  // 좋아요 추가 요청 메서드
  const [addFavorite, { loading: addLoading }] = useMutation<ApiResponse>(
    `/api/products/${router.query.id}/favorite`
  );
  // 좋아요 제거 요청 메서드
  const [removeFavorite, { loading: removeLoading }] = useMutation<ApiResponse>(
    `/api/products/${router.query.id}/favorite`,
    "DELETE"
  );

  // 2022/03/26 - 좋아요 토글 이벤트 - by 1-blue
  const onClickFavorite = useCallback(() => {
    if (addLoading) return toast.error("이미 좋아요 추가 처리중입니다.");
    if (removeLoading) return toast.error("이미 좋아요 제거 처리중입니다.");

    favoriteMutate(
      (prev) =>
        prev && {
          ...prev,
          isFavorite: !prev.isFavorite,
          favoriteCount: prev.isFavorite
            ? prev.favoriteCount - 1
            : prev.favoriteCount + 1,
        },
      false
    );

    if (favoriteResponse?.isFavorite) removeFavorite(null);
    else addFavorite(null);
  }, [
    addLoading,
    removeLoading,
    favoriteMutate,
    favoriteResponse,
    addFavorite,
    removeFavorite,
  ]);

  return (
    <>
      <HeadInfo
        title={`blemarket | Product`}
        description={`제목: ${product.name}
          가격: ${`${priceWithCommas(product.price)}원`}
          설명: ${product.description}`}
        photo={product.image}
      />

      {/* 상품 이미지, 유저 프로필, 이름, 설명, 가격, 키워드, 좋아요 */}
      <article className="px-4 pb-8 mb-8 border-b">
        <section className="mb-2">
          <Photo photo={product.image} className="h-96 w-full" $contain />
        </section>
        <section>
          <Profile user={product.user} />
        </section>
        <section className="flex flex-col space-y-3">
          <h2 className="font-bold text-3xl">{product.name}</h2>
          <p className="text-gray-900 p-4 rounded-md bg-gray-200 whitespace-pre">
            {product.description}
          </p>
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-lg">
              {priceWithCommas(product.price)}원
            </span>
            <span className="font-semibold text-xs">
              ( {dateFormat(product.updatedAt!, "YYYY/MM/DD hh:mm:ss")} )
            </span>
          </div>
          <ul className="flex space-x-2 mb-4 flex-wrap">
            {product.keywords.split(" ").map((keyword) => (
              <li key={keyword}>
                <Link href={`/?keyword=${keyword}`}>
                  <a className="p-2 bg-slate-200 rounded-lg text-orange-400 font-semibold text-sm focus:outline-orange-500">
                    {keyword}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-between space-x-2">
            <Button
              text="Talk to seller"
              type="button"
              className="flex-1"
              $primary
            />
            <Button
              onClick={onClickFavorite}
              className={combineClassNames(
                "p-3 rounded-md focus:outline-none focus:ring-2",
                favoriteResponse?.isFavorite
                  ? "bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-500"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 focus:ring-gray-500"
              )}
              text={
                <div className="flex space-x-2">
                  <Icon
                    shape={ICON_SHAPE.HEART}
                    $fill={favoriteResponse?.isFavorite}
                  />
                  <span>{favoriteResponse?.favoriteCount}</span>
                </div>
              }
            />
          </div>
        </section>
      </article>

      {/* 유사 상품들 */}
      <article className="px-4">
        <h3 className="font-bold text-2xl mb-6">유사한 상품들</h3>
        <ul className="grid grid-cols-2 gap-4">
          {relatedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <a className="group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-4 focus:rounded-md">
                <div className="overflow-hidden rounded-md">
                  <Photo
                    photo={product.image}
                    className="h-56 w-full group-hover:scale-105 duration-500"
                  />
                </div>
                <h3 className="text-gray-700 mt-2 group-hover:underline underline-offset-2 decoration-orange-500 decoration-2">
                  {product.name}
                </h3>
                <p className="text-gray-900 font-semibold group-hover:underline underline-offset-2 decoration-orange-500 decoration-2">
                  {product.price}원
                </p>
              </a>
            </Link>
          ))}
        </ul>
      </article>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const productId = Number(context.params?.id);

  // 특정 상품과 작성자 찾기
  const findProductWithUser = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  // 특정 상품의 관련 상품 찾기
  const keywords = findProductWithUser?.keywords.split(" ");
  const relatedProducts = await prisma.product.findMany({
    where: {
      OR: keywords?.map((keyword) => ({
        keywords: {
          contains: keyword,
        },
      })),
      AND: {
        id: {
          not: productId,
        },
      },
    },
    take: 8,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return {
    props: {
      ok: true,
      message: "특정 상품에 대한 정보를 가져왔습니다.",
      product: JSON.parse(JSON.stringify(findProductWithUser)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    },
  };
};

export default ProductsDatail;
