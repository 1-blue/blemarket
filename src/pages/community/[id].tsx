import { useCallback, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// type
import { IAnswerForm, ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Post } from "@prisma/client";

// util
import { combineClassNames } from "@src/libs/client/util";
import useMutation from "@src/libs/client/useMutation";
import useUser from "@src/libs/client/useUser";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Profile from "@src/components/common/Profile";
import Textarea from "@src/components/common/Textarea";
import Answer from "@src/components/common/Answer";

interface IPostWithEtc extends Post {
  user: SimpleUser;
  _count: {
    recommendations: number;
  };
}
interface IPostResponse extends ApiResponse {
  post: IPostWithEtc;
  isRecommendation: boolean;
  answerCount: number;
}

interface IAnswerWithUser {
  id: number;
  answer: string;
  updatedAt: string;
  user: SimpleUser;
}
interface IAnswerResponse extends ApiResponse {
  answers: IAnswerWithUser[];
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  // 게시글 상세 정보 요청
  const { data, mutate: postMutate } = useSWR<IPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
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
  // 궁금해요 추가
  const [addRecommendation, { loading: addRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`);
  // 궁금해요 제거
  const [removeRecommendation, { loading: removeRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`, "DELETE");
  // 답변 추가
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

    postMutate(
      (prev) =>
        prev && {
          ...prev,
          isRecommendation: !prev?.isRecommendation,
          post: {
            ...prev.post,
            _count: {
              recommendations: prev.isRecommendation
                ? prev.post._count.recommendations - 1
                : prev.post._count.recommendations + 1,
            },
          },
        },
      false
    );

    if (data?.isRecommendation) removeRecommendation(null);
    else addRecommendation(null);
  }, [
    addRecommendationLoading,
    removeRecommendationLoading,
    postMutate,
    data,
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
                  updatedAt: Date.now().toString(),
                  user: {
                    id: user?.id!,
                    name: user?.name!,
                    avatar: user?.avatar!,
                  },
                },
              ],
            },
          ],
        false
      );

      // 임시로 댓글 개수 + 1
      postMutate(
        (prev) => prev && { ...prev, answerCount: prev.answerCount + 1 },
        false
      );

      createAnswer(body);

      reset();
    },
    [answerLoading, answerMutate, postMutate, user, createAnswer, reset]
  );

  return (
    <>
      <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        동네질문
      </span>
      {/* 게시글 작성자 */}
      <Profile
        id={data?.post.user.id}
        name={data?.post.user.name}
        avatar={data?.post.user.avatar}
      />

      {/* 게시글 내용, 궁금해요와 답변아이콘 및 개수 */}
      <div>
        <div className="flex mt-2 px-4 text-gray-700">
          <span className="text-orange-500 font-medium mr-2">Q</span>
          <span className="whitespace-pre">{data?.post.question}</span>
        </div>
        <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
          <button
            className={combineClassNames(
              "flex space-x-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4 focus:rounded-sm",
              data?.isRecommendation ? "text-orange-500 font-semibold" : ""
            )}
            type="button"
            onClick={onClickRecommendation}
          >
            <Icon shape={ICON_SHAPE.CHECK} width={16} height={16} />
            <span>궁금해요 {data?.post._count.recommendations}</span>
          </button>
          <button
            type="button"
            className={combineClassNames(
              "flex space-x-2 items-center text-sm",
              toggleAnswer ? "text-orange-500 font-semibold" : ""
            )}
            onClick={() => setToggleAnswer((prev) => !prev)}
          >
            <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
            <span>답변 {data?.answerCount}</span>
          </button>
        </div>
      </div>

      {toggleAnswer && (
        <>
          {/* 댓글들 */}
          {answersData?.map((answers) =>
            answers.answers.map((answer) => (
              <Answer key={answer.id} answer={answer} />
            ))
          )}
          {/* 댓글 불러오기 버튼 */}
          {Math.ceil(data?.answerCount! / offset) > size ? (
            <Button
              onClick={() => setSize((prev) => prev + 1)}
              text={`댓글 ${data?.answerCount! - offset * size}개 더 불러오기`}
              $primary
              className="block mx-auto px-4"
              $loading={typeof answersData?.[size - 1] === "undefined"}
            />
          ) : (
            <div className="text-center text-sm font-semibold">
              더 이상 불러올 댓글이 존재하지 않습니다.
            </div>
          )}
        </>
      )}

      {/* 댓글 제출 폼 */}
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
    </>
  );
};

export default CommunityPostDetail;
