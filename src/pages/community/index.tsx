import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GetStaticProps, NextPage } from "next";

// type
import { ICON_SHAPE, ApiResponse, SEARCH_CONDITION } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import SideButton from "@src/components/common/SideButton";
import Pagination from "@src/components/common/Pagination";
import HeadInfo from "@src/components/common/HeadInfo";

// component
import CommunityItem from "@src/components/CommunityItem";

// hook
import useCoords from "@src/libs/hooks/useCoords";
import usePagination from "@src/libs/hooks/usePagination";

// util
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
  // 2022/04/13 - 위도, 경도 허용 요청 및 가져오기 - by 1-blue
  const { latitude, longitude } = useCoords(
    "GPS를 허용하지 않아서 위치기반 검색을 할 수 없습니다."
  );
  // 2022/04/13 - 검색할 거리 - by 1-blue
  const [distance, setDistance] = useState(10);
  // 2022/04/23 - 디바운싱 - by 1-blue
  const [debounce, setDebounce] = useState(false);
  // 2022/04/23 - timerId - by 1-blue
  const timerId = useRef<any>(null);
  // 2022/04/13 - 검색 조건 - by 1-blue
  const [condition, setCondition] = useState<SEARCH_CONDITION>(
    SEARCH_CONDITION.ALL
  );
  // 2022/04/13 - 검색 조건에 의해 검색된 게시글들 - by 1-blue
  const [{ data: searchedPost, isValidating }, { page, setPage }, { offset }] =
    usePagination<IPostResponse>(
      +condition === SEARCH_CONDITION.AROUND &&
        latitude &&
        longitude &&
        debounce
        ? `/api/posts?latitude=${latitude}&longitude=${longitude}&distance=${distance}`
        : null,
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
    (e: React.FormEvent<HTMLInputElement>) => {
      if (!debounce) {
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          setDebounce(true);
        }, 300);
      }
      setDistance(+e.currentTarget.value);
    },
    [debounce, setDebounce]
  );

  // 2022/04/07 - 랜더링할 게시글 - by 1-blue
  const [targetPosts, setTargetPost] = useState<IPostResponse>(props);
  // 2022/04/13 - 검색 조건에 의해 검색된 게시글 랜더링을 위한 데이터 교체 - by 1-blue
  useEffect(() => {
    if (!searchedPost) return;
    setTargetPost(searchedPost);
    setDebounce(false);
  }, [setTargetPost, searchedPost, setDebounce]);
  useEffect(() => {
    if (!isValidating) return;
    setDebounce(false);
  }, [isValidating]);

  return (
    <>
      <HeadInfo
        title={`blemarket | Community`}
        description="커뮤니티 페이지입니다. 😄"
        photo={null}
      />

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

        {/* 게시글들 */}
        <section>
          <ul className="space-y-8">
            {targetPosts.posts.map((post) => (
              <CommunityItem key={post.id} post={post} />
            ))}
          </ul>
        </section>
      </article>

      <article>
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
      </article>

      <SideButton
        url="/community/write"
        contents={<Icon shape={ICON_SHAPE.PENCIL} />}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // GPS관계없이, 최신 게시글 10개
  const postsPromise = await prisma.post.findMany({
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
  const postCountPromise = await prisma.post.count();

  const [posts, postCount] = await Promise.all([
    postsPromise,
    postCountPromise,
  ]);

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
