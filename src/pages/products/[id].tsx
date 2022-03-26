import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

// type
import { ICON_SHAPE, IMutationResult } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";

interface IProductWithUser extends Product {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface IProductWithUserResponse extends IMutationResult {
  product: IProductWithUser;
  relatedProducts: Product[];
}

const ProductsDatail: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<IProductWithUserResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  return (
    <>
      {/* >> 로딩 스피너 추가 */}
      <div className="px-4 pb-8 mb-8 border-b">
        {/* 상품 이미지 */}
        <div className="h-96 w-full bg-slate-300" />
        {/* 게시글 작성자 프사, 이름 */}
        <Link href={`/users/profiles/${data?.product.user.id}`}>
          <a className="flex items-center border-y py-4 px-2 space-x-2 cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:rounded-md">
            <div className="w-14 h-14 rounded-full bg-slate-300" />
            <div>
              <p className="font-semibold">{data?.product.user.name}</p>
              <span className="text-xs font-semibold text-gray-500">
                View profile &rarr;
              </span>
            </div>
          </a>
        </Link>
        {/* 상품 이름, 가격, 설명, 채팅, 좋아요 */}
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl mb-1">{data?.product.name}</h1>
          <p className="font-semibold text-xl mb-4">{data?.product.price}원</p>
          <p className="text-gray-900 mb-4 whitespace-pre">
            {data?.product.description}
          </p>
          <div className="flex justify-between space-x-2  ">
            <Button text="Talk to seller" type="button" className="flex-1" />
            <button className="p-3 bg-red-100 rounded-md hover:bg-red-200 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">
              <Icon shape={ICON_SHAPE.HEART} />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <h2 className="font-bold text-2xl mb-6">Similar items</h2>
        <div className="grid grid-cols-2 gap-4">
          {data?.relatedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <a>
                <div className="h-56 w-full bg-slate-300 mb-2" />
                <h3 className="text-gray-700">{product.name}</h3>
                <p className="text-gray-900 font-semibold">
                  ${product.price}원
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsDatail;
