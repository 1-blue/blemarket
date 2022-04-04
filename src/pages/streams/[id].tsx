import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// type
import { ApiResponse, IMessageForm, SimpleUser } from "@src/types";
import { Message as MessageType, Stream } from "@prisma/client";

// common-component
import Input from "@src/components/common/Input";
import Button from "@src/components/common/Button";

// component
import Message from "@src/components/Message";

// hooks
import useMutation from "@src/libs/client/useMutation";
import useUser from "@src/libs/client/useUser";

interface IStreamWithUser extends Stream {
  user: SimpleUser;
}
interface IStreamResponse extends ApiResponse {
  stream: IStreamWithUser;
  messageCount: number;
}

interface IMessageResponse extends ApiResponse {
  createdMessage: MessageType;
}

interface IGetMessageResponse extends ApiResponse {
  messages: {
    id: number;
    message: string;
    updatedAt: Date;
    user: SimpleUser;
  }[];
}

const StreamDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  // 스트림 상세 정보 요청
  const { data: streamData } = useSWR<IStreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<IMessageForm>();
  const [createMessage, { data: messageData, loading }] =
    useMutation<IMessageResponse>(`/api/streams/${router.query.id}/messages`);
  const [offset] = useState(10);
  // 채팅들 요청
  const {
    data: getMessageData,
    size,
    setSize,
    mutate: getMessageMutate,
  } = useSWRInfinite<IGetMessageResponse>(
    router.query.id
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.messages.length)
            return null;
          return `/api/streams/${router.query.id}/messages?page=${pageIndex}&offset=${offset}`;
        }
      : () => null
  );

  // 2022/04/01 - 메시지 생성 - by 1-blue
  const onValid = useCallback(
    (body: IMessageForm) => {
      if (loading) return toast.error("메시지를 보내는 중입니다.");

      createMessage(body);
    },
    [createMessage, loading]
  );

  // 2022/04/01 - 메시지 생성 유효성 검사 실패 시 사용할 이벤트 - by 1-blue
  const onInvalid = useCallback(
    (error) => toast.error(error.message.message),
    []
  );

  // 2022/04/01 - 메시지 뮤테이션 - by 1-blue
  useEffect(() => {
    if (messageData?.ok) {
      getMessageMutate(
        (prev) =>
          prev && [
            ...prev,
            {
              ok: true,
              message: "getMessageMutate로 메시지 추가!",
              messages: [
                {
                  id: Date.now(),
                  message: messageData.createdMessage.message,
                  updatedAt: Date.now() as any,
                  user: {
                    id: user?.id!,
                    name: user?.name!,
                    avatar: user?.avatar!,
                  },
                },
              ],
            },
          ],
        false
      );

      reset();
    }
  }, [messageData, getMessageMutate, reset, user]);

  return (
    <>
      {/* 비디오, 제목, 가격, 설명 */}
      <div className="px-4 space-y-2 mb-16">
        <div className="w-full aspect-video bg-slate-300 rounded-md mb-2" />
        <h1 className="text-gray-700 font-semibold text-2xl">
          {streamData?.stream.title}
        </h1>
        <span className="inline-block">{streamData?.stream.price}원</span>
        <p className="whitespace-pre p-2 bg-slate-200 rounded-lg">
          {streamData?.stream.description}
        </p>
      </div>

      {/* 메시지들 */}
      <div className="p-4 mb-24 space-y-4 h-[50vh] overflow-y-auto bg-slate-200 sm:rounded-lg ">
        <h3 className="text-sm text-center bg-indigo-300 p-2 rounded-md font-bold text-white">
          첫 번째 메시지입니다.
        </h3>
        {/* 댓글들 */}
        {getMessageData?.map((messages) =>
          messages.messages.map((message) => (
            <Message
              key={message.id}
              message={message.message}
              updatedAt={message.updatedAt}
              user={message.user}
              $reversed={user?.id === message.user.id}
            />
          ))
        )}
        {/* 댓글 불러오기 버튼 */}
        {Math.ceil(streamData?.messageCount! / offset) > size ? (
          <Button
            onClick={() => setSize((prev) => prev + 1)}
            text={`메시지 ${
              streamData?.messageCount! - offset * size
            }개 더 불러오기`}
            $primary
            className="block mx-auto px-4"
            $loading={typeof getMessageData?.[size - 1] === "undefined"}
          />
        ) : (
          <h3 className="text-sm text-center bg-indigo-300 p-2 rounded-md font-bold text-white">
            더 이상 불러올 댓글이 존재하지 않습니다.
          </h3>
        )}

        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          className="fixed bottom-24 max-w-lg inset-x-0 mx-auto flex shadow-md"
        >
          <Input
            register={register("message", {
              required: {
                value: true,
                message: "메시지를 입력해주세요!",
              },
              maxLength: {
                value: 191,
                message: "191자 이하로 입력해주세요!",
              },
            })}
            type="text"
            className="flex-1 rounded-none rounded-l-md border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
          />
          <Button
            type="submit"
            text="&rarr;"
            className="bg-orange-400 px-3 text-white rounded-r-md ring-orange-400 hover:bg-orange-500"
            $loading={loading}
          />
        </form>
      </div>
    </>
  );
};

export default StreamDetail;
