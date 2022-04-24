import React, { useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// type
import { ApiResponse } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Button from "@src/components/common/Button";
import Textarea from "@src/components/common/Textarea";
import HeadInfo from "@src/components/common/HeadInfo";
import Spinner from "@src/components/common/Spinner";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useCoords from "@src/libs/hooks/useCoords";
import useResponseToast from "@src/libs/hooks/useResponseToast";
import usePermission from "@src/libs/hooks/usePermission";

// util
import useSWR from "swr";
import { useRouter } from "next/router";

interface IResponseOfPost extends ApiResponse {
  post: Post;
}
type QuestionForm = {
  question: string;
  latitude: number | null;
  longitude: number | null;
};

const Write: NextPage = () => {
  const router = useRouter();

  // 2022/04/24 - 수정할 게시글 정보 패치 - by 1-blue
  const { data: post } = useSWR<IResponseOfPost>(
    router.query.postId ? `/api/posts/${router.query.postId}` : null
  );

  // 2022/04/13 - 위도, 경도 허용 요청 및 가져오기 - by 1-blue
  const coords = useCoords(
    "GPS를 허용하지 않아서 위치기반 검색결과에서 제외됩니다."
  );
  // 2022/04/13 - 질문 폼 - by 1-blue
  const { register, handleSubmit, setValue } = useForm<QuestionForm>();
  const [modifyQuestion, { loading, data }] = useMutation<IResponseOfPost>(
    `/api/posts/${post?.post.id}`,
    "PATCH"
  );
  // 2022/04/18 - 기존 데이터 주입 - by 1-blue
  useEffect(() => {
    if (!post) return;

    setValue("question", post.post.question);
    if (post.post.latitude) setValue("latitude", post.post.latitude);
    if (post.post.longitude) setValue("longitude", post.post.longitude);
  }, [setValue, post]);
  // 2022/03/27 - 질문 생성 - by 1-blue
  const onCreateQuestion = useCallback(
    (body: QuestionForm) => {
      if (loading)
        return toast.warning(
          "이미 게시글을 수정중입니다.\n잠시만 기다려주세요!"
        );

      modifyQuestion({ ...body, ...coords });
    },
    [modifyQuestion, coords, loading]
  );
  // 2022/03/27 - 질문 생성 완료 시 페이지 이동 - 1-blue
  useResponseToast({
    response: data,
    successMessage: "질문을 수정했습니다!",
    move: data?.post.id ? `/community/${data.post.id}` : "",
  });

  // 2022/04/18 - 접근 권한 확인 - by 1-blue
  usePermission({
    userId: post?.post.userId,
    message: "접근 권한이 없습니다.",
    move: "/community",
  });

  if (!post) return <Spinner kinds="page" />;

  return (
    <>
      <HeadInfo
        title={`blemarket | Modify-Question`}
        description="커뮤니티 수정 페이지입니다. 😄"
        photo={null}
      />

      <article>
        <form className="px-4" onSubmit={handleSubmit(onCreateQuestion)}>
          <Textarea
            register={register("question", { required: true })}
            className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 resize-none"
            rows={6}
            placeholder="Ask this question!"
          />
          <Button
            type="submit"
            text="생성"
            $primary
            $loading={loading}
            className="w-full mt-2"
          />
        </form>
      </article>

      {loading && <Spinner kinds="page" />}
    </>
  );
};

export default Write;
