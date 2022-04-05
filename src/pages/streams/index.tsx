import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

// type
import { ApiResponse, ICON_SHAPE, SimpleUser } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import Pagination from "@src/components/common/Pagination";

// component
import SideButton from "@src/components/common/SideButton";

// hook
import usePagination from "@src/libs/hooks/usePagination";

interface IStreamResponse extends ApiResponse {
  streams: {
    id: number;
    title: string;
    user: SimpleUser;
  }[];
  streamCount: number;
}

const Live: NextPage = () => {
  // 2022/04/05 - 스트림 패치 - by 1-blue
  const [{ data }, { page, setPage }, { offset }] =
    usePagination<IStreamResponse>("/api/streams", {});

  return (
    <>
      <article>
        <ul className="divide-y-2">
          {data?.streams.map((stream) => (
            <li key={stream.id}>
              <Link href={`/streams/${stream.id}`}>
                <a className="flex flex-col space-y-2 p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:rounded-sm">
                  <div className="w-full aspect-video bg-slate-300 rounded-md" />
                  <h3 className="text-gray-700 font-semibold text-sm">
                    {stream.title}
                  </h3>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </article>

      <Pagination
        url="/api/streams"
        page={page}
        offset={offset}
        setPage={setPage}
        max={Math.ceil((data?.streamCount as number) / offset)}
      />

      <SideButton
        url="/streams/create"
        contents={<Icon shape={ICON_SHAPE.CAMERA} />}
      />
    </>
  );
};

export default Live;
