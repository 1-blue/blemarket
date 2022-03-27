import { useCallback } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";

// type
import {
  IAnswerForm,
  ICON_SHAPE,
  IMutationResult,
  SimpleUser,
} from "@src/types";
import { Answer as AnswerType, Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Profile from "@src/components/common/Profile";
import Textarea from "@src/components/common/Textarea";
import Answer from "@src/components/common/Answer";
import { combineClassNames } from "@src/libs/client/util";
import useMutation from "@src/libs/client/useMutation";

interface AnswerWithUser extends AnswerType {
  user: SimpleUser;
}
interface IPostWithEtc extends Post {
  answers: AnswerWithUser[];
  user: SimpleUser;
  _count: {
    recommendations: number;
  };
}
interface IPostResponse extends IMutationResult {
  post: IPostWithEtc;
  isRecommendation: boolean;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<IPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [recommendation, { data: recommendationData, loading }] = useMutation(
    `/api/posts/${router.query.id}/recommendation`
  );
  const { register, handleSubmit } = useForm<IAnswerForm>();

  // 2022/03/27 - 궁금해요 클릭 - by 1-blue
  const onClickRecommendation = useCallback(() => {
    if (loading) return;

    mutate(
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

    recommendation(null);
  }, [loading, mutate, recommendation]);

  // 2022/03/27 - 답변 추가 - by 1-blue
  const onValid = useCallback((x: IAnswerForm) => {
    console.log(x);
  }, []);

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
          <span className="flex space-x-2 items-center text-sm">
            <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
            <span>답변 {data?.post.answers.length}</span>
          </span>
        </div>
      </div>
      {/* 답변 */}
      {data?.post.answers.map((answer) => (
        <Answer key={answer.id} answer={answer} />
      ))}
      <form className="px-4 mt-5" onSubmit={handleSubmit(onValid)}>
        <Textarea
          register={register("answer")}
          rows={6}
          placeholder="Answer this question!"
        />
        <Button type="submit" text="Reply" $primary className="w-full mt-2" />
      </form>
    </>
  );
};

export default CommunityPostDetail;
