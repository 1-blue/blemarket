import React, { useCallback, useEffect, useState } from "react";
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
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
import Modal from "@src/components/common/Modal";
import Spinner from "@src/components/common/Spinner";

// component
import AnswerSection from "@src/components/Answer/AnswerSection";
import ProductSimilar from "@src/components/Product/ProductSimilar";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useMe from "@src/libs/hooks/useMe";
import SideButton from "@src/components/common/SideButton";
import useResponseToast from "@src/libs/hooks/useResponseToast";

interface IProduct extends Product {
  user: SimpleUser;
  _count: {
    answers: number;
  };
  keywords: {
    keyword: string;
  }[];
  records: {
    kinds: "Sale" | "Favorite" | "Reserved" | "Purchase";
  }[];
}
interface IProductResponse extends ApiResponse {
  product: IProduct;
}
interface IResponseOfRelationProducts extends ApiResponse {
  relatedUserProducts: IProduct[];
  relatedKeywordProducts: IProduct[];
}
interface IFavoriteResponse extends ApiResponse {
  isFavorite: boolean;
  favoriteCount: number;
}
interface ICreateRoomResponse extends ApiResponse {
  roomId: number;
}

const ProductsDatail: NextPage<IProductResponse> = ({ product }) => {
  const router = useRouter();
  const { me } = useMe();

  // 2022/04/21 - 상품의 종류들 ( 판매, 예약, 구매 등 ) - by 1-blue
  const kindsList = product?.records?.map((v) => v.kinds);

  // 2022/04/13 - 댓글 토글값 - by 1-blue
  const [toggleAnswer, setToggleAnswer] = useState(true);

  // 2022/04/13 - 게시글의 좋아요 정보 - by 1-blue
  const { data: favoriteResponse, mutate: favoriteMutate } =
    useSWR<IFavoriteResponse>(
      router.query.id ? `/api/products/${router.query.id}/favorite` : null
    );
  // 2022/04/13 - 좋아요 추가 요청 메서드 - by 1-blue
  const [addFavorite, { loading: addLoading }] = useMutation<ApiResponse>(
    `/api/products/${router.query.id}/favorite`
  );
  // 2022/04/13 - 좋아요 제거 요청 메서드 - by 1-blue
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

  // 2022/04/13 - 채팅방 생성 메서드 - by 1-blue
  const [createRoom, { data: createRoomResponse, loading: createRoomLoading }] =
    useMutation<ICreateRoomResponse>(`/api/chats/room`);
  // 2022/04/12 - 채팅방 생성 - by 1-blue
  const onCreateRoom = useCallback(() => {
    if (product.userId === me?.id)
      return toast.error("본인의 상품에는 채팅을 할 수 없습니다.");
    if (createRoomLoading)
      return toast.warning("채팅방을 생성중입니다.\n잠시 기다려주세요!");
    if (kindsList.includes("Reserved"))
      return toast.warning("예약중인 상품이면 판매자와 대화할 수 없습니다.");
    if (kindsList.includes("Purchase"))
      return toast.warning("이미 판매한 상품이면 판매자와 대화할 수 없습니다.");
    createRoom({
      ownerId: product.userId,
      title: product.name,
      productId: product.id,
    });
  }, [createRoom, product, me, createRoomLoading, kindsList]);
  // 2022/04/12 - 채팅방 생성 시 채팅방으로 이동 - by 1-blue
  useEffect(() => {
    if (!createRoomResponse?.ok) return;

    toast.success("채팅방으로 이동합니다.");
    router.push(`/chats/${createRoomResponse.roomId}`);
  }, [router, createRoomResponse]);

  // 2022/04/16 - 연관 상품 요청 - by 1-blue
  const { data: relationProducts, isValidating: relationProductsLoading } =
    useSWR<IResponseOfRelationProducts>(
      router.query.id ? `/api/products/${router.query.id}/relation` : null
    );

  // 2022/04/17 - 상품 제거 및 수정 모달 토글 값 - by 1-blue
  const [toggleModal, setToggleModal] = useState(false);
  // 2022/04/17 - 상품 제거 - by 1-blue
  const [
    removeProduct,
    { data: removeProductResponse, loading: removeProductLoading },
  ] = useMutation<ApiResponse>(`/api/products/${router.query.id}`, "DELETE");
  // 2022/04/17 - 상품 제거 - 1-blue
  const onRemoveProduct = useCallback(() => {
    if (removeProductLoading) return toast.warning("이미 상품을 제거중입니다!");
    removeProduct({});
  }, [removeProduct, removeProductLoading]);
  // 2022/04/17 - 상품 제거 성공 시 메시지 및 페이지 이동 - by 1-blue
  useResponseToast({
    response: removeProductResponse,
    move: "/",
  });

  if (router.isFallback) return <Spinner kinds="page" />;

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
        <section
          className="mb-2"
          onClick={() =>
            toast.success(
              "사이즈 테스트, 사이즈 테스트, 사이즈 테스트, 사이즈 테스트,사이즈 테스트"
            )
          }
        >
          <Photo photo={product.image} className="h-96 w-full" $contain />
        </section>
        <section>
          <Profile user={product.user} />
        </section>
        <section className="flex flex-col space-y-4">
          <h2 className="font-bold text-3xl">
            {kindsList.includes("Reserved") && (
              <span className="text-orange-500 underline underline-offset-2">
                [예약중]
              </span>
            )}{" "}
            {kindsList.includes("Purchase") && (
              <span className="text-indigo-400 underline underline-offset-2">
                [판매완료]
              </span>
            )}{" "}
            {product.name}
          </h2>
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
          <ul className="flex space-x-2 flex-wrap">
            {product.keywords.map(({ keyword }) => (
              <li key={keyword} className="mb-3">
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
              text="판매자와 대화하기"
              type="button"
              className="flex-1"
              $primary
              onClick={onCreateRoom}
              $loading={createRoomLoading}
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

      {/* 댓글 영역 */}
      <article>
        <button
          type="button"
          onClick={() => setToggleAnswer((prev) => !prev)}
          className="mx-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-4 focus:rounded-sm hover:text-orange-400 focus:text-orange-400"
        >
          댓글 {product._count.answers}개
        </button>
        <AnswerSection
          target="products"
          toggle={toggleAnswer}
          count={product._count.answers}
          setToggle={setToggleAnswer}
        />
      </article>

      {/* 연관 상품 불러오는 동안 보여줄 컨텐츠 */}
      {relationProductsLoading && (
        <>
          <hr className="my-8 border border-gray-200" />
          <section className="flex justify-center items-center">
            <span className=" text-xl font-bold">
              연관 상품을 로딩중입니다...
            </span>
            <Button text="" $loading />
          </section>
        </>
      )}

      {/* 구분선 */}
      {relationProducts &&
        relationProducts.relatedKeywordProducts.length > 0 && (
          <hr className="my-8 border border-gray-200" />
        )}

      {/* 유사 상품들 */}
      {relationProducts && relationProducts.relatedKeywordProducts.length > 0 && (
        <article className="px-4">
          <h3 className="font-bold text-2xl mb-2">유사한 상품들</h3>
          <ul className="grid grid-cols-2 gap-4">
            {relationProducts.relatedKeywordProducts.map((product) => (
              <ProductSimilar key={product.id} product={product} />
            ))}
          </ul>
        </article>
      )}

      {/* 구분선 */}
      {relationProducts && relationProducts.relatedUserProducts.length > 0 && (
        <hr className="my-8 border border-gray-200" />
      )}

      {/* 작성자의 다른 상품들 */}
      {relationProducts && relationProducts.relatedUserProducts.length > 0 && (
        <article className="px-4">
          <h3 className="font-bold text-2xl mb-2">작성자의 다른 상품들</h3>
          <ul className="grid grid-cols-2 gap-4">
            {relationProducts.relatedUserProducts.map((product) => (
              <ProductSimilar key={product.id} product={product} />
            ))}
          </ul>
        </article>
      )}

      {/* 상품 삭제 및 수정 모달 토글 버튼 */}
      {product.userId === me?.id && (
        <SideButton
          contents={<Icon shape={ICON_SHAPE.DOTS_H} />}
          onClick={() => setToggleModal((prev) => !prev)}
        />
      )}

      {/* 상품 수정 및 삭제 모달창 */}
      {toggleModal && (
        <Modal position="middle" setToggleModal={setToggleModal}>
          <>
            <Link
              href={{
                pathname: "/products/modify",
                query: { productId: router.query.id },
              }}
            >
              <a className="block text-xl p-4 w-full hover:text-orange-500 hover:bg-orange-100 transition-colors text-center">
                상품 수정
              </a>
            </Link>
            <button
              type="button"
              onClick={onRemoveProduct}
              className="text-xl p-4 w-full hover:text-orange-500 hover:bg-orange-100 transition-colors"
            >
              상품 삭제
            </button>
          </>
        </Modal>
      )}

      {/* 상품 삭제 중 메시지 */}
      {removeProductLoading && (
        <aside className="fixed bg-black/60 top-0 left-0 w-full h-full z-20 flex justify-center items-center">
          <section className="bg-white px-8 py-12 rounded-md">
            <span className="text-xl text-orange-500 whitespace-pre-line">
              {"상품을 삭제중입니다...\n잠시만 기다려주세요!"}
            </span>
          </section>
        </aside>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const productId = Number(context.params?.id);

  // 특정 상품과 작성자 찾기
  const foundProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
      keywords: {
        select: {
          keyword: true,
        },
      },
      records: {
        select: {
          kinds: true,
        },
      },
    },
  });

  return {
    props: {
      ok: true,
      message: "특정 상품에 대한 정보를 가져왔습니다.",
      product: JSON.parse(JSON.stringify(foundProduct)),
    },
  };
};

export default ProductsDatail;
