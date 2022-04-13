import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { toast } from "react-toastify";

// common-component
import Button from "@src/components/common/Button";

// component
import Message from "@src/components/Message";

// type
import { ApiResponse, IChatForm, SimpleUser } from "@src/types";
import { Chat } from "@prisma/client";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useUser from "@src/libs/hooks/useUser";
import useInfiniteScroll from "@src/libs/hooks/useInfiniteScroll";

interface IChatWithUser extends Chat {
  User: SimpleUser;
}
interface IChatResponse extends ApiResponse {
  chats: IChatWithUser[];
  isMine: boolean;
}
interface IAddChatResponse extends ApiResponse {
  createdChat: IChatWithUser;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<IChatForm>();

  // 채팅 추가 메서드
  const [addChat, { data: addChatResponse, loading: addChatLoading }] =
    useMutation<IAddChatResponse>(`/api/chats/${router.query.id}`);
  // 2022/04/12 - 채팅 추가 - by 1-blue
  const onAddChat = useCallback(
    (body: IChatForm) => {
      if (addChatLoading)
        return toast.warning(
          "채팅을 보내는 중입니다.\n잠시후에 다시 시도해주세요!"
        );
      addChat(body);
    },
    [addChat, addChatLoading]
  );

  // 채팅 불러오기
  const [hasMoreChat, setHasMoreChat] = useState(true);
  const {
    data: chatsResponse,
    mutate: chatMutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite<IChatResponse>((pageIndex, prevPageData) => {
    if (!router.query.id) return;
    if (prevPageData && !prevPageData.chats.length) {
      setHasMoreChat(false);
      return null;
    }

    return `/api/chats/${router.query.id}?page=${pageIndex}&offset=${15}`;
  });
  // 2022/04/12 - 채팅 추가 시 업데이트 ( mutate ) - by 1-blue
  useEffect(() => {
    if (!addChatResponse?.ok || !addChatResponse.createdChat) return;

    chatMutate(
      (prev) =>
        prev && [
          ...prev,
          {
            ok: true,
            message: "mutate로 추가!",
            chats: [addChatResponse.createdChat],
            isMine: true,
          },
        ],
      false
    );

    reset();
  }, [chatMutate, addChatResponse, reset]);

  // // 2022/04/13 - 채팅 인피니티 스크롤링 훅 - by 1-blue
  useInfiniteScroll({ condition: hasMoreChat && !isValidating, setSize });

  useEffect(() => {
    if (chatsResponse && !chatsResponse[0].isMine) {
      toast.error("채팅방에 접근할 권한이 없습니다.");
      router.replace("/chats");
    }
  }, [chatsResponse, router]);

  return (
    <div className="space-y-4 bg-slate-200 min-h-[70vh] p-4 rounded-sm mb-[10vh]">
      {chatsResponse && chatsResponse?.[0]?.chats.length > 0 ? (
        <ul className="space-y-2">
          <li className="text-lg text-center bg-indigo-400 p-2 rounded-md text-white">
            채팅방에 입장하셨습니다.
          </li>
          {chatsResponse[0].isMine &&
            chatsResponse.map((chatResponse) =>
              chatResponse?.chats.map((chat) => (
                <Message
                  key={chat.id}
                  message={chat.chat}
                  user={chat.User}
                  updatedAt={chat.updatedAt}
                  $reversed={user?.id === chat.User.id}
                />
              ))
            )}
          {!hasMoreChat && (
            <li className="text-lg text-center bg-indigo-400 py-2 rounded-md text-white">
              더 이상 채팅이 없습니다.
            </li>
          )}
          {isValidating && (
            <li className="text-lg text-center bg-indigo-400 py-2 rounded-md text-white">
              채팅을 불러오는 중입니다...
            </li>
          )}
        </ul>
      ) : (
        <span className="text-center block">
          현재 채팅이 없습니다. 채팅을 입력해주세요!
        </span>
      )}

      <form
        onSubmit={handleSubmit(onAddChat)}
        className="fixed bottom-24 max-w-lg w-10/12 inset-x-0 mx-auto flex"
      >
        <input
          type="text"
          className="peer rounded-l-md border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 flex-[8.5]"
          {...register("chat")}
        />
        <Button
          type="submit"
          text="전송"
          className="peer-focus:ring-1 bg-orange-400 text-white rounded-r-md ring-orange-400 hover:bg-orange-500 focus:outline-orange-500 flex-[1.5] py-[10px]"
          $loading={addChatLoading}
        />
      </form>
    </div>
  );
};

export default ChatDetail;
