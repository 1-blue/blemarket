import React from "react";
import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Link from "next/link";
import useSWR from "swr";

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
  chats: {
    chat: string;
  }[];
}

interface IRoomsResponse extends ApiResponse {
  rooms: IRoomWithUser[];
}

const Chats: NextPage<IRoomsResponse> = ({ rooms }) => {
  // const { data: roomsResponse } = useSWR<IRoomsResponse>("/api/chats/room");

  return (
    <div className="divide-y-[1px]">
      <div />
      {rooms.map((room) => (
        <Link key={room.id} href={`/chats/${room.id}`}>
          <a className="flex px-4 cursor-pointer py-3 items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded-md hover:bg-slate-200 transition-colors">
            <Avatar user={room.users[0]} />
            <div>
              <p className="text-base font-semibold text-gray-700">
                {room.users[0].name}
              </p>
              <p className="text-sm text-gray-500">
                {room.chats.length > 0
                  ? room.chats[room.chats.length - 1].chat
                  : "아직 입력된 채팅이 없습니다."}
              </p>
            </div>
            <div className="flex-1" />
            {/* >>> 마지막 메시지 작성 시간으로 변경하기 */}
            <span className="self-start text-xs text-gray-500">
              {timeFormat(room.updatedAt)}
            </span>
          </a>
        </Link>
      ))}
      <div />
    </div>
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
        // >>> 마지막 메시지만 가져오도록 수정 필요
        chats: {
          select: {
            chat: true,
          },
        },
      },
      // >>> 마지막 메시지가 가장 빠른순으로 정렬하도록 수정 필요
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      props: {
        ok: true,
        message: "모든 채팅방을 가져왔습니다.",
        rooms: JSON.parse(JSON.stringify(rooms)),
      },
    };
  }
);

export default Chats;
