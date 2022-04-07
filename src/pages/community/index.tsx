import React, { useCallback, useEffect, useState } from "react";
import type { GetStaticProps, NextPage } from "next";

// type
import { ICON_SHAPE, ApiResponse, SEARCH_CONDITION } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import SideButton from "@src/components/common/SideButton";
import Pagination from "@src/components/common/Pagination";

// component
import CommunityItem from "@src/components/CommunityItem";

// hook
import useCoords from "@src/libs/hooks/useCoords";
import usePagination from "@src/libs/hooks/usePagination";
import prisma from "@src/libs/client/prisma";

export interface IPostWithEtc extends Post {
  user: {
    name: string;
  };
  _count: {
    answers: number;
    recommendations: number;
  };
}

interface IPostResponse extends ApiResponse {
  posts: IPostWithEtc[];
  postCount: number;
}

const Community: NextPage<IPostResponse> = (props) => {
  const { latitude, longitude } = useCoords(
    "GPS를 허용하지 않아서 위치기반 검색을 할 수 없습니다."
  );
  const [distance, setDistance] = useState(10);
  const [condition, setCondition] = useState<SEARCH_CONDITION>(
    SEARCH_CONDITION.ALL
  );
  const [{ data }, { page, setPage }, { offset }] =
    usePagination<IPostResponse>(
      +condition === SEARCH_CONDITION.AROUND && latitude && longitude
        ? `/api/posts?latitude=${latitude}&longitude=${longitude}&distance=${distance}`
        : `/api/posts`,
      {}
    );

  // 2022/03/28 - 검색 조건 변경 - by 1-blue
  const onChangeCondition = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) =>
      setCondition(e.currentTarget.value as unknown as SEARCH_CONDITION),
    []
  );
  // 2022/03/28 - 거리 조절 - by 1-blue
  const onChangeDistance = useCallback(
    (e: React.FormEvent<HTMLInputElement>) =>
      setDistance(+e.currentTarget.value),
    []
  );

  // 2022/04/07 - 랜더링할 게시글 - by 1-blue
  const [targetPosts, setTargetPost] = useState<IPostResponse>(props);

  useEffect(() => {
    if (!data) return;
    setTargetPost(data);
  }, [setTargetPost, data]);

  return (
    <>
      <article className="px-4 space-y-8">
        {/* 검색 조건 변경 및 검색 거리 변경 */}
        <section className="flex justify-between items-center">
          <select
            value={condition}
            onChange={onChangeCondition}
            className="rounded-md focus:ring-orange-500 focus:ring-2 focus:border-orange-500"
          >
            <option value={SEARCH_CONDITION.ALL}>모든 게시글 검색</option>
            <option
              value={SEARCH_CONDITION.AROUND}
              disabled={!(latitude && longitude)}
            >
              주변 게시글 검색
            </option>
          </select>

          {/* 검색 거리 */}
          {+condition === SEARCH_CONDITION.AROUND && (
            <div className="relative w-1/2">
              <input
                type="range"
                min={1}
                value={distance}
                onChange={onChangeDistance}
                className="w-full py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:rounded-md"
              />
              <span className="absolute left-0 top-8 text-xs font-semibold">
                1km
              </span>
              <span className="absolute right-0 top-8 text-xs font-semibold">
                100km
              </span>
              <span className="absolute left-0 top text-xs font-semibold">
                현재 값: {distance}km
              </span>
            </div>
          )}
        </section>

        {/* 아이템 */}
        <section>
          <ul className="space-y-8">
            {targetPosts.posts.map((post) => (
              <CommunityItem key={post.id} post={post} />
            ))}
          </ul>
        </section>
      </article>

      <Pagination
        url={
          +condition === SEARCH_CONDITION.AROUND && latitude && longitude
            ? `/api/posts?latitude=${latitude}&longitude=${longitude}&distance=${distance}`
            : `/api/posts`
        }
        page={page}
        offset={offset}
        setPage={setPage}
        max={Math.ceil((targetPosts.postCount as number) / offset!)}
      />

      <SideButton
        url="/community/write"
        contents={<Icon shape={ICON_SHAPE.PENCIL} />}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // GPS관계없이, 최신 게시글 10개
  const posts = await prisma.post.findMany({
    take: 10,
    skip: 0,
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          answers: true,
          recommendations: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  // 게시글 개수
  const postCount = await prisma.post.count();

  return {
    props: {
      ok: true,
      message: "최신 게시글 10개를 가져왔습니다.",
      posts: JSON.parse(JSON.stringify(posts)),
      postCount,
    },
  };
};

export default Community;
