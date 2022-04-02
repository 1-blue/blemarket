import React, { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// type
import { ApiResponse, ICON_SHAPE, SimpleUser } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import Pagination from "@src/components/common/Pagination";

// component
import SideButton from "@src/components/SideButton";

interface IStreamResponse extends ApiResponse {
  streams: {
    id: number;
    title: string;
    user: SimpleUser;
  }[];
  streamCount: number;
}

const Live: NextPage = () => {
  const [page, setPage] = useState<number>(1);
  const [offset] = useState<number>(10);
  const { data } = useSWR<IStreamResponse>(
    `/api/streams?page=${page}&offset=${offset}`
  );
  // 2022/04/02 - 다음 페이지 미리 패치하기 - by 1-blue
  useSWR(`/api/streams?page=${page + 1}&offset=${offset}`);

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

      <Pagination
        page={page}
        setPage={setPage}
        max={Math.ceil((data?.streamCount as number) / offset)}
      />

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
