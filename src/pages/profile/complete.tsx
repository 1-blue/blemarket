import React, { useCallback } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";

// type
import { ApiResponse, SimpleUser } from "@src/types";

// common-component
import Avatar from "@src/components/common/Avatar";
import Spinner from "@src/components/common/Spinner";
import Button from "@src/components/common/Button";

// hook
import useMe from "@src/libs/hooks/useMe";
import useMutation from "@src/libs/hooks/useMutation";
import useResponseToast from "@src/libs/hooks/useResponseToast";

interface IResponseRoomWithUser extends ApiResponse {
  roomWithUser: {
    id: number;
    name: string;
    productId: number;
    users: SimpleUser[];
  }[];
}
type PurchaseForm = {
  userId: number;
};

const Purchase: NextPage = () => {
  const router = useRouter();
  const { me } = useMe();

  const { register, watch, handleSubmit } = useForm<PurchaseForm>();

  // 2022/04/22 - 현재 상품에 대한 채팅방 정보 패치 - by 1-blue
  const { data, isValidating } = useSWR<IResponseRoomWithUser>(
    router.query.productId
      ? `/api/users/me/room/${router.query.productId}`
      : null
  );
  // 2022/04/22 - 상품 판매 완료로 변경 - by 1-blue
  const [changePurchase, { data: purchaseResponse, loading: purchaseLoading }] =
    useMutation<ApiResponse>(
      `/api/products/${router.query.productId}/kinds`,
      "PATCH"
    );

  // 2022/04/22 - 현재 상품 구매 확정 - by 1-blue
  const onPurchase = useCallback(
    (body: PurchaseForm) => {
      changePurchase({
        currentKinds: router.query.currentKinds,
        afterKinds: "Purchase",
        userId: body.userId,
      });
    },
    [changePurchase, router]
  );

  // 2022/04/22 -  - by 1-blue
  useResponseToast({
    response: purchaseResponse,
    move: "/profile/purchase",
  });

  if (isValidating) return <Spinner kinds="page" />;

  return (
    <>
      <section className="bg-slate-200 p-4 rounded-md space-y-2 mx-4">
        <h3 className="text-gray-400 text-sm">거래할 상품</h3>
        <h2 className="text-lg">
          {data?.roomWithUser?.[0]?.name
            ? data.roomWithUser[0].name
            : "상품을 판매할 상대가 없습니다."}
        </h2>
      </section>
      <section className="p-4">
        <form onSubmit={handleSubmit(onPurchase)}>
          <ul className="flex flex-col space-y-4">
            {data?.roomWithUser.map((v) => {
              const user = v.users[0].id === me?.id ? v.users[1] : v.users[0];

              return (
                <li key={v.id} className="flex items-center space-x-2">
                  <label
                    htmlFor={user.name}
                    className="flex items-center space-x-2"
                  >
                    <Avatar user={user} className="w-9 h-9" />
                    <span className="text-xl">{user.name}</span>
                  </label>
                  <input
                    type="radio"
                    id={user.name}
                    value={user.id}
                    {...register("userId")}
                  />
                </li>
              );
            })}
            <li>
              <Button
                text="구매자 선택"
                $primary
                className="w-full disabled:bg-slate-300 disabled:cursor-not-allowed"
                disabled={!watch("userId")}
              />
            </li>
          </ul>
        </form>
      </section>

      {purchaseLoading && <Spinner kinds="page" />}
    </>
  );
};

export default Purchase;
