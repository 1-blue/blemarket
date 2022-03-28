import React, { useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

// type
import { IMutationResult, IQuestionForm } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Button from "@src/components/common/Button";
import Textarea from "@src/components/common/Textarea";
import useMutation from "@src/libs/client/useMutation";
import useCoords from "@src/libs/client/useCoords";

interface IWriteResponse extends IMutationResult {
  post: Post;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IQuestionForm>();
  const [question, { loading, data }] =
    useMutation<IWriteResponse>("/api/posts");
  const coords = useCoords();

  // 2022/03/27 - 질문 생성 - by 1-blue
  const onValid = useCallback(
    (body: IQuestionForm) => question({ ...body, ...coords }),
    [question, coords]
  );

  // 2022/03/27 - 게시글 생성 완료 시 페이지 이동 - 1-blue
  useEffect(() => {
    if (!data?.ok) return;

    router.replace(`/community/${data.post.id}`);
  }, [data, router]);

  return (
    <form className="px-4" onSubmit={handleSubmit(onValid)}>
      <Textarea
        register={register("question", { required: true })}
        className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 resize-none"
        rows={6}
        placeholder="Ask this question!"
      />
      <Button
        type="submit"
        text="Submit"
        $primary
        $loading={loading}
        className="w-full mt-2"
      />
    </form>
  );
};

export default Write;
