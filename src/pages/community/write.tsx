import React, { useCallback } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";

// type
import { ApiResponse } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Button from "@src/components/common/Button";
import Textarea from "@src/components/common/Textarea";
import HeadInfo from "@src/components/common/HeadInfo";

// hooks
import useMutation from "@src/libs/hooks/useMutation";
import useCoords from "@src/libs/hooks/useCoords";

// hook
import useResponseToast from "@src/libs/hooks/useResponseToast";

interface IWriteResponse extends ApiResponse {
  post: Post;
}
type QuestionForm = {
  question: string;
  latitude: number | null;
  longitude: number | null;
};

const Write: NextPage = () => {
  // 2022/04/13 - 위도, 경도 허용 요청 및 가져오기 - by 1-blue
  const coords = useCoords(
    "GPS를 허용하지 않아서 위치기반 검색결과에서 제외됩니다."
  );
  // 2022/04/13 - 질문 폼 - by 1-blue
  const { register, handleSubmit } = useForm<QuestionForm>();
  const [question, { loading, data }] =
    useMutation<IWriteResponse>("/api/posts");
  // 2022/03/27 - 질문 생성 - by 1-blue
  const onCreateQuestion = useCallback(
    (body: QuestionForm) => question({ ...body, ...coords }),
    [question, coords]
  );
  // 2022/03/27 - 질문 생성 완료 시 페이지 이동 - 1-blue
  useResponseToast({
    response: data,
    successMessage: "질문을 생성했습니다!",
    move: data?.post.id ? `/community/${data.post.id}` : "",
  });

  return (
    <>
      <HeadInfo
        title={`blemarket | Create Question`}
        description="커뮤니티 생성 페이지입니다. 😄"
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
    </>
  );
};

export default Write;
