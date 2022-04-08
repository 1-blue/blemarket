import { useCallback, useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// type
import { IAnswerForm, ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Profile from "@src/components/common/Profile";
import Textarea from "@src/components/common/Textarea";

// component
import Answer from "@src/components/Answer";

// util
import { combineClassNames } from "@src/libs/client/util";
import prisma from "@src/libs/client/prisma";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useUser from "@src/libs/hooks/useUser";
import { dateFormat } from "@src/libs/client/dateFormat";
import HeadInfo from "@src/components/common/HeadInfo";

interface IPostWithUser extends Post {
  user: SimpleUser;
}
interface IPostResponse extends ApiResponse {
  post: IPostWithUser;
}

interface IRecommendationResponse extends ApiResponse {
  isRecommendation: boolean;
  recommendationCount: number;
}

interface IAnswerWithUser {
  id: number;
  answer: string;
  updatedAt: Date | number;
  user: SimpleUser;
}
interface IAnswerResponse extends ApiResponse {
  answers: IAnswerWithUser[];
  answerCount: number;
}

const CommunityPostDetail: NextPage<IPostResponse> = ({ post }) => {
  const router = useRouter();
  const { user } = useUser();

  // 게시글의 궁금해요 정보 요청
  const { data: recommendationData, mutate: recommendationMutate } =
    useSWR<IRecommendationResponse>(
      router.query.id ? `/api/posts/${router.query.id}/recommendation` : null
    );
  const [offset] = useState(5);
  // 댓글들 요청
  const {
    data: answersData,
    size,
    setSize,
    mutate: answerMutate,
  } = useSWRInfinite<IAnswerResponse>(
    router.query.id
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.answers.length) return null;
          return `/api/posts/${router.query.id}/answer?page=${pageIndex}&offset=${offset}`;
        }
      : () => null
  );
  // 궁금해요 추가 메서드
  const [addRecommendation, { loading: addRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`);
  // 궁금해요 제거 메서드
  const [removeRecommendation, { loading: removeRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`, "DELETE");
  // 답변 추가 메서드
  const [createAnswer, { loading: answerLoading }] = useMutation(
    `/api/posts/${router.query.id}/answer`
  );
  const { register, handleSubmit, reset } = useForm<IAnswerForm>();
  const [toggleAnswer, setToggleAnswer] = useState(true);

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

  // 2022/03/27 - 답변 추가 - by 1-blue
  const onValid = useCallback(
    (body: IAnswerForm) => {
      if (answerLoading) return;

      // 임시로 작성 댓글 추가
      answerMutate(
        (prev) =>
          prev && [
            ...prev,
            {
              ok: true,
              message: "answerMutate로 댓글 추가!",
              answers: [
                {
                  id: Date.now(),
                  answer: body.answer!,
                  updatedAt: Date.now(),
                  user: {
                    id: user?.id!,
                    name: user?.name!,
                    avatar: user?.avatar!,
                  },
                },
              ],
              answerCount: prev[0].answerCount + 1,
            },
          ],
        false
      );

      createAnswer(body);

      reset();
    },
    [answerLoading, answerMutate, user, createAnswer, reset]
  );

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
            <span>
              답변 {answersData?.[answersData.length - 1].answerCount}
            </span>
          </button>
        </section>
      </article>

      {/* 댓글과 댓글 불러오기 버튼 */}
      {toggleAnswer && (
        <article>
          <section>
            <ul>
              {answersData?.map((answers) =>
                answers.answers.map((answer) => (
                  <Answer key={answer.id} answer={answer} />
                ))
              )}
            </ul>
          </section>
          <section>
            {Math.ceil(
              answersData?.[answersData.length - 1].answerCount! / offset
            ) > size ? (
              <Button
                onClick={() => setSize((prev) => prev + 1)}
                text={`댓글 ${
                  answersData?.[answersData.length - 1].answerCount! -
                  offset * size
                }개 더 불러오기`}
                $primary
                className="block mx-auto px-4"
                $loading={typeof answersData?.[size - 1] === "undefined"}
              />
            ) : (
              <span className="block text-center text-sm font-semibold my-2">
                더 이상 불러올 댓글이 존재하지 않습니다.
              </span>
            )}
          </section>
        </article>
      )}

      {/* 댓글 제출 폼 */}
      <article>
        <form className="px-4 mt-5" onSubmit={handleSubmit(onValid)}>
          <Textarea
            register={register("answer", { required: true })}
            rows={6}
            placeholder="Answer this question!"
          />
          <Button
            type="submit"
            text="Reply"
            $primary
            $loading={answerLoading}
            className="w-full mt-2"
          />
        </form>
      </article>
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
