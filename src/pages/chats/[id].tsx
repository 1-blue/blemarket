import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Socket, io } from "socket.io-client";

// common-component
import Button from "@src/components/common/Button";

// component
import Message from "@src/components/Message";

// type
import {
  ApiResponse,
  ClientToServerEvents,
  ServerToClientEvents,
  SimpleUser,
} from "@src/types";
import { Chat } from "@prisma/client";

// hook
import useMe from "@src/libs/hooks/useMe";
import useSWRInfinite from "swr/infinite";
import Spinner from "@src/components/common/Spinner";

interface IChatWithUser extends Chat {
  User: SimpleUser;
}
interface IChatResponse extends ApiResponse {
  chats: IChatWithUser[];
  isMine: boolean;
}
type ChatForm = {
  chat: string;
};

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { me } = useMe();

  // 2022/04/13 - 채팅 폼 - by 1-blue
  const { register, handleSubmit, reset } = useForm<ChatForm>();
  // 2022/06/10 - 연결한 소켓 - by 1-blue
  const [socket, setSocket] = useState<null | Socket<
    ServerToClientEvents,
    ClientToServerEvents
  >>(null);

  // 2022/06/10 - 기존 채팅 불러오기 - by 1-blue
  const [hasMoreChat, setHasMoreChat] = useState(true);
  const {
    data: chatsResponse,
    mutate: chatMutate,
    setSize,
    isValidating: loadChatsLoading,
  } = useSWRInfinite<IChatResponse>((pageIndex, prevPageData) => {
    if (!router.query.id) return;
    if (prevPageData && !prevPageData.chats.length) {
      setHasMoreChat(false);
      return null;
    }

    return `/api/chats/${router.query.id}?page=${pageIndex}&offset=${50}`;
  });

  // 2022/06/10 - 채팅 스크롤 최하단에서 실행 - by 1-blue
  useEffect(() => {
    if (chatsResponse && chatsResponse.length === 1 && !loadChatsLoading) {
      document.documentElement.scrollTop =
        document.documentElement.scrollHeight;
    }
  }, [chatsResponse, loadChatsLoading]);

  // 2022/06/10 - 서버와 소켓 연결 및 채팅방 입장 - by 1-blue
  useEffect(() => {
    if (!me) return;

    const mySocket = io(process.env.NEXT_PUBLIC_VERCEL_URL!, {
      path: "/api/chats/socketio",
      // withCredentials: true,
      // transports: ["websocket"],
    });

    setSocket((prev) => prev || mySocket);

    // 소켓 연결 성공 했다면
    mySocket.on("connect", () => {
      // 채팅방 입장
      mySocket.emit("onJoinRoom", router.query.id as string);

      // 채팅받기 이벤트 등록
      mySocket.on("onReceive", ({ user, chat }) => {
        chatMutate(
          (prev) =>
            prev && [
              ...prev,
              {
                ok: true,
                message: "mutate로 추가",
                isMine: true,
                chats: [
                  {
                    User: user,
                    chat,
                    id: Date.now(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    roomId: +(router.query.id as string),
                    userId: user.id,
                  },
                ],
              },
            ]
        );
      });
    });
  }, [me, router, chatMutate]);

  // 2022/06/10 - 채팅 전송 - by 1-blue
  const onAddChatting = useCallback(
    ({ chat }: ChatForm) => {
      if (!me) return;
      if (chat.trim() === "") return toast.error("내용을 채우고 전송해주세요!");
      if (chat.length > 200)
        return toast.error(
          `200자 이내만 입력가능합니다... ( 현재 ${chat.length}자 )`
        );

      socket?.emit("onSend", {
        userId: me.id,
        roomId: router.query.id as string,
        chat,
      });

      chatMutate(
        (prev) =>
          prev && [
            ...prev,
            {
              ok: true,
              message: "mutate로 추가",
              isMine: true,
              chats: [
                {
                  User: {
                    id: me.id,
                    name: me.name,
                    avatar: me.avatar,
                  },
                  chat,
                  id: Date.now(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  roomId: +(router.query.id as string),
                  userId: me.id,
                },
              ],
            },
          ]
      );

      document.documentElement.scrollTop =
        document.documentElement.scrollHeight;

      reset();
    },
    [me, reset, router, socket, chatMutate]
  );
  // 2022/06/10 - 무한 스크롤링 이벤트 함수 - by 1-blue
  const infiniteScrollEvent = useCallback(() => {
    if (window.scrollY <= 200 && hasMoreChat && !loadChatsLoading) {
      setSize((prev) => prev + 1);
    }
  }, [hasMoreChat, loadChatsLoading, setSize]);
  // 2022/06/10 - 무한 스크롤링 이벤트 등록/해제 - by 1-blue
  useEffect(() => {
    window.addEventListener("scroll", infiniteScrollEvent);

    return () => window.removeEventListener("scroll", infiniteScrollEvent);
  }, [infiniteScrollEvent]);

  // 2022/06/10 - 권한 없이 채팅방 입장 - by 1-blue
  useEffect(() => {
    if (chatsResponse && !chatsResponse[0].isMine) {
      toast.error("채팅방에 접근할 권한이 없습니다.");
      router.replace("/chats");
    }
  }, [chatsResponse, router]);

  return (
    <>
      <article className="space-y-4 bg-slate-200 min-h-[70vh] p-4 rounded-sm mb-[10vh]">
        {loadChatsLoading && (
          <h3 className="text-lg text-center bg-indigo-400 p-2 rounded-md text-white">
            <Spinner kinds="button" />
            채팅을 불러오는 중입니다...
          </h3>
        )}
        {!hasMoreChat && (
          <li className="text-lg text-center bg-indigo-400 py-2 rounded-md text-white list-none">
            더 이상 불러올 채팅이 없습니다.
          </li>
        )}
        {chatsResponse?.[0].isMine ? (
          <ul className="space-y-2">
            {[...chatsResponse]
              .reverse()
              .map(({ chats }) =>
                chats.map((chat) => (
                  <Message
                    key={chat.id}
                    message={chat.chat}
                    user={chat.User}
                    updatedAt={chat.updatedAt}
                    $reversed={me?.id === chat.User.id}
                  />
                ))
              )}
          </ul>
        ) : (
          <>
            {!loadChatsLoading && (
              <span className="text-center block">
                현재 채팅이 없습니다. 채팅을 입력해주세요!
              </span>
            )}
          </>
        )}
      </article>

      <article>
        <form
          onSubmit={handleSubmit(onAddChatting)}
          className="fixed bottom-24 max-w-lg w-10/12 inset-x-0 mx-auto flex"
        >
          <input
            type="text"
            className="peer rounded-l-md border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 flex-[8.5]"
            {...register("chat")}
            autoFocus
          />
          <Button
            type="submit"
            text="전송"
            className="peer-focus:ring-1 bg-orange-400 text-white rounded-r-md ring-orange-400 hover:bg-orange-500 focus:outline-orange-500 flex-[1.5] py-[10px]"
          />
        </form>
      </article>
    </>
  );
};

export default ChatDetail;
