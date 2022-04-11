import { useCallback, useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Profile from "@src/components/common/Profile";
import HeadInfo from "@src/components/common/HeadInfo";

// util
import { combineClassNames } from "@src/libs/client/util";
import { dateFormat } from "@src/libs/client/dateFormat";
import prisma from "@src/libs/client/prisma";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import AnswerSection from "@src/components/Answer/AnswerSection";

interface IPostWithUser extends Post {
  user: SimpleUser;
  _count: {
    answers: number;
  };
}
interface IPostResponse extends ApiResponse {
  post: IPostWithUser;
}

interface IRecommendationResponse extends ApiResponse {
  isRecommendation: boolean;
  recommendationCount: number;
}

const CommunityPostDetail: NextPage<IPostResponse> = ({ post }) => {
  const router = useRouter();

  // 게시글의 궁금해요 정보 요청
  const { data: recommendationData, mutate: recommendationMutate } =
    useSWR<IRecommendationResponse>(
      router.query.id ? `/api/posts/${router.query.id}/recommendation` : null
    );
  // 궁금해요 추가 메서드
  const [addRecommendation, { loading: addRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`);
  // 궁금해요 제거 메서드
  const [removeRecommendation, { loading: removeRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`, "DELETE");
  // 2022/03/27 - 궁금해요 클릭 - by 1-blue
  const onClickRecommendation = useCallback(() => {
    if (addRecommendationLoading)
      return toast.error("이미 궁금해요 추가 처리중입니다.");
    if (removeRecommendationLoading)
      return toast.error("이미 궁금해요 제거 처리중입니다.");

    recommendationMutate(
      (prev) =>
        prev && {
          ...prev,
          recommendationCount: prev.isRecommendation
            ? prev.recommendationCount - 1
            : prev.recommendationCount + 1,
          isRecommendation: !prev.isRecommendation,
        },
      false
    );

    if (recommendationData?.isRecommendation) removeRecommendation(null);
    else addRecommendation(null);
  }, [
    addRecommendationLoading,
    removeRecommendationLoading,
    recommendationMutate,
    recommendationData,
    addRecommendation,
    removeRecommendation,
  ]);

  //  댓글 토글 값
  const [toggleAnswer, setToggleAnswer] = useState(true);

  return (
    <>
      <HeadInfo
        title={`blemarket | Community`}
        description={post.question}
        photo={null}
      />

      {/* 게시글 작성자, 내용, 궁금해요와 답변아이콘 버튼 */}
      <article>
        <section>
          <div className="flex justify-between items-baseline">
            <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              동네질문
            </span>
            <span className="font-semibold text-xs">
              ( {dateFormat(post.updatedAt!, "YYYY/MM/DD hh:mm:ss")} )
            </span>
          </div>
          {post.user && <Profile user={post.user} />}
        </section>
        <section className="flex mt-2 px-4 text-gray-700">
          <span className="text-orange-500 font-medium mr-2">Q .</span>
          <span className="whitespace-pre">{post.question}</span>
        </section>
        <section className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
          <button
            className={combineClassNames(
              "flex space-x-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4 focus:rounded-sm",
              recommendationData?.isRecommendation
                ? "text-orange-500 font-semibold"
                : ""
            )}
            type="button"
            onClick={onClickRecommendation}
          >
            <Icon shape={ICON_SHAPE.CHECK} width={16} height={16} />
            <span>궁금해요 {recommendationData?.recommendationCount}</span>
          </button>
          <button
            type="button"
            className={combineClassNames(
              "flex space-x-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4 focus:rounded-sm",
              toggleAnswer ? "text-orange-500 font-semibold" : ""
            )}
            onClick={() => setToggleAnswer((prev) => !prev)}
          >
            <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
            <span>답변 {post._count.answers}</span>
          </button>
        </section>
      </article>

      {/* 댓글 영역 */}
      <AnswerSection
        target="posts"
        toggle={toggleAnswer}
        count={post._count.answers}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const postId = Number(context.params?.id);

  const postWithUser = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
  });

  return {
    props: {
      ok: true,
      message: "특정 게시글을 가져왔습니다.",
      post: JSON.parse(JSON.stringify(postWithUser)),
    },
  };
};

export default CommunityPostDetail;
