import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// type
import { ApiResponse, ICON_SHAPE, SimpleUser } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// component
import SideButton from "@src/components/SideButton";

interface IStreamResponse extends ApiResponse {
  streams: {
    id: number;
    title: string;
    user: SimpleUser;
  }[];
}

const Live: NextPage = () => {
  const { data } = useSWR<IStreamResponse>("/api/streams");

  return (
    <>
      <div className="divide-y-2">
        {data?.streams.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <a className="flex flex-col space-y-2 p-4">
              <div className="w-full aspect-video bg-slate-300 rounded-md" />
              <h3 className="text-gray-700 font-semibold text-sm">
                {stream.title}
              </h3>
            </a>
          </Link>
        ))}
      </div>

      <Link href="/streams/create">
        <a>
          <SideButton>
            <Icon shape={ICON_SHAPE.CAMERA} />
          </SideButton>
        </a>
      </Link>
    </>
  );
};

export default Live;
