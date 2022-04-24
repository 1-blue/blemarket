import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// common-components
import Avatar from "@src/components/common/Avatar";
import Spinner from "@src/components/common/Spinner";

// type
import { ApiResponse, SimpleUser } from "@src/types";
import { Room } from "@prisma/client";

// util
import { timeFormat } from "@src/libs/client/dateFormat";

interface IRoomWithUser extends Room {
  users: SimpleUser[];
}
interface IResponseRooms extends ApiResponse {
  rooms: IRoomWithUser[];
  roomsOfLastChat: {
    roomId: number;
    chat: string;
    updatedAt: Date;
  }[];
}

const Chats: NextPage = () => {
  const { data } = useSWR<IResponseRooms>("/api/chats/room");

  if (!data) return <Spinner kinds="page" />;

  return (
    <article className="divide-y-[1px]">
      <div />
      {data.rooms.length > 0 ? (
        data.rooms.map((room, index) => (
          <Link key={room.id} href={`/chats/${room.id}`}>
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded-md hover:bg-slate-200 transition-colors">
              <Avatar user={room.users[0]} />
              <div>
                <p className="text-base font-semibold text-gray-700">
                  {room.users[0].name}
                </p>
                <p className="text-sm text-gray-500">
                  {data.roomsOfLastChat?.[index].chat
                    ? data.roomsOfLastChat?.[index].chat
                    : "아직 입력된 채팅이 없습니다."}
                </p>
              </div>
              <div className="flex-1" />
              <span className="self-start text-xs text-gray-500">
                {timeFormat(data.roomsOfLastChat?.[index].updatedAt)}
              </span>
            </a>
          </Link>
        ))
      ) : (
        <h4 className="text-center font-medium text-2xl py-8 text-gray-500">
          채팅방이 없습니다.
        </h4>
      )}
      <div />
    </article>
  );
};

export default Chats;
