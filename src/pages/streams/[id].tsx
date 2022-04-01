import React, { useCallback, useEffect } from "react";
import type { NextPage } from "next";
import useSWR from "swr";
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

interface IMessageWithUser extends MessageType {
  user: SimpleUser;
}
interface IStreamWithEtc extends Stream {
  user: SimpleUser;
  messages: IMessageWithUser[];
}
interface IStreamResponse extends ApiResponse {
  stream: IStreamWithEtc;
}

interface IMessageResponse extends ApiResponse {
  messageWithUser: IMessageWithUser;
}

const StreamDetail: NextPage = () => {
  const router = useRouter();
  const { data: streamData, mutate } = useSWR<IStreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<IMessageForm>();
  const [createMessage, { data: messageData, loading }] =
    useMutation<IMessageResponse>(`/api/streams/${router.query.id}/messages`);
  const { user } = useUser();

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
      mutate(
        (prev) =>
          prev && {
            ...prev,
            stream: {
              ...prev?.stream,
              messages: [...prev?.stream.messages, messageData.messageWithUser],
            },
          },
        false
      );

      reset();
    }
  }, [messageData, mutate, reset]);

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
        {streamData?.stream.messages.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            updatedAt={message.updatedAt}
            userName={message.user.name}
            $reversed={user?.id === message.user.id}
          />
        ))}
        {!messageData?.ok && (
          <h3 className="text-sm text-center bg-indigo-300 p-2 rounded-md font-bold text-white">
            채팅방에 입장하셨습니다.
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
