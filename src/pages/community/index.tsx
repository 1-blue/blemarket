import React, { useCallback, useState } from "react";
import type { NextPage } from "next";

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

const Community: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const [distance, setDistance] = useState(10);
  const [condition, setCondition] = useState<SEARCH_CONDITION>(
    SEARCH_CONDITION.AROUND
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
            <option value={SEARCH_CONDITION.AROUND}>주변 게시글 검색</option>
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
            {data?.posts.map((post) => (
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
        max={Math.ceil((data?.postCount as number) / offset!)}
      />

      <SideButton
        url="/community/write"
        contents={<Icon shape={ICON_SHAPE.PENCIL} />}
      />
    </>
  );
};

export default Community;
