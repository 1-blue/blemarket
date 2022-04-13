import React from "react";
import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Link from "next/link";

// common-components
import Avatar from "@src/components/common/Avatar";

// type
import { ApiResponse, SimpleUser } from "@src/types";
import { Room } from "@prisma/client";

// util
import { timeFormat } from "@src/libs/client/dateFormat";
import { withSsrSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

interface IRoomWithUser extends Room {
  users: SimpleUser[];
}
interface IRoomsResponse extends ApiResponse {
  rooms: IRoomWithUser[];
  roomsOfLastChat: {
    roomId: number;
    chat: string;
    updatedAt: Date;
  }[];
}

const Chats: NextPage<IRoomsResponse> = ({ rooms, roomsOfLastChat }) => {
  return (
    <article className="divide-y-[1px]">
      <div />
      {rooms.map((room, index) => (
        <Link key={room.id} href={`/chats/${room.id}`}>
          <a className="flex px-4 cursor-pointer py-3 items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded-md hover:bg-slate-200 transition-colors">
            <Avatar user={room.users[0]} />
            <div>
              <p className="text-base font-semibold text-gray-700">
                {room.users[0].name}
              </p>
              <p className="text-sm text-gray-500">
                {roomsOfLastChat?.[index].chat
                  ? roomsOfLastChat?.[index].chat
                  : "아직 입력된 채팅이 없습니다."}
              </p>
            </div>
            <div className="flex-1" />
            <span className="self-start text-xs text-gray-500">
              {timeFormat(roomsOfLastChat?.[index].updatedAt)}
            </span>
          </a>
        </Link>
      ))}
      <div />
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async (context: NextPageContext) => {
    const userId = context.req?.session.user?.id;

    const rooms = await prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          where: {
            NOT: {
              id: userId,
            },
          },
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // 방들의 마지막 채팅만 추출하고 시간순 정렬
    const chatPromises = rooms.map((room) =>
      prisma.chat.findMany({
        take: 1,
        where: {
          roomId: room.id,
        },
        select: {
          chat: true,
          updatedAt: true,
          roomId: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
    );
    const roomsOfLastChat = (await Promise.all(chatPromises)).flat(1);
    roomsOfLastChat.sort((x, y) => (+x.updatedAt > +y.updatedAt ? -1 : 1));

    // 마지막 채팅을 기준으로 방들을 정렬
    const sortRooms = roomsOfLastChat.map((chat) =>
      rooms.find((room) => room.id === chat.roomId)
    );

    return {
      props: {
        ok: true,
        message: "모든 채팅방을 가져왔습니다.",
        rooms: JSON.parse(JSON.stringify(sortRooms)),
        roomsOfLastChat: JSON.parse(JSON.stringify(roomsOfLastChat)),
      },
    };
  }
);

export default Chats;
