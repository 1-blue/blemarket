import React, { useEffect, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
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

// util
import { timeFormat } from "@src/libs/client/dateFormat";
import prisma from "@src/libs/client/prisma";
import HeadInfo from "@src/components/common/HeadInfo";

interface IStreamResponse extends ApiResponse {
  streams: {
    id: number;
    title: string;
    updatedAt: Date;
    user: SimpleUser;
  }[];
  streamCount: number;
}

const Live: NextPage<IStreamResponse> = (props) => {
  // 2022/04/05 - 스트림 패치 - by 1-blue
  const [{ data: streamsResponse }, { page, setPage }, { offset }] =
    usePagination<IStreamResponse>("/api/streams", {});

  // 2022/04/08 - 사용할 데이터 - by 1-blue
  const [targetStreams, setTargetStreams] = useState<IStreamResponse>(props);

  // 2022/04/08 - 최신 데이터로 업데이트 - by 1-blue
  useEffect(() => {
    if (!streamsResponse) return;
    setTargetStreams(streamsResponse);
  }, [streamsResponse, setTargetStreams]);

  return (
    <>
      <HeadInfo
        title="blemarket | Stream"
        description="blemarket의 스트림 페이지입니다. 😄"
        photo={null}
      />

      <article>
        <ul className="divide-y-2">
          {targetStreams.streams.map((stream) => (
            <li key={stream.id}>
              <Link href={`/streams/${stream.id}`}>
                <a className="flex flex-col space-y-2 p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:rounded-sm">
                  <div className="w-full aspect-video bg-slate-300 rounded-md" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-gray-700 font-semibold text-base">
                      {stream.title}
                    </h3>
                    <span className="text-xs font-semibold">
                      ( {timeFormat(stream.updatedAt)}부터 시작 )
                    </span>
                  </div>
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
        max={Math.ceil(targetStreams.streamCount / offset)}
      />

      <SideButton
        url="/streams/create"
        contents={<Icon shape={ICON_SHAPE.CAMERA} />}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const streams = await prisma.stream.findMany({
    take: 10,
    skip: 0,
    select: {
      id: true,
      title: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  const streamCount = await prisma.stream.count();

  return {
    props: {
      ok: true,
      message: "스트림들을 가져왔습니다.",
      streams: JSON.parse(JSON.stringify(streams)),
      streamCount,
    },
  };
};

export default Live;
