import React, { useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

// common-component
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Textarea from "@src/components/common/Textarea";
import Notice from "@src/components/common/Notice";

// type
import { ApiResponse, IStramForm } from "@src/types";
import { Stream } from "@prisma/client";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import { toast } from "react-toastify";

interface IStreamResponse extends ApiResponse {
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { data, loading }] =
    useMutation<IStreamResponse>("/api/streams");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IStramForm>({ mode: "onBlur" });

  // 2022/04/01 - 스트림 생성 - by 1-blue
  const onValid = useCallback(
    (body: IStramForm) => createStream(body),
    [createStream]
  );

  // 2022/04/01 - 폼에러 메시지 초기값 - by 1-blue
  useEffect(() => {
    setError("title", { message: "" });
    setError("price", { message: "" });
    setError("description", { message: "" });
  }, [setError]);

  // 2022/04/01 - 스트림 생성 시 리다이렉트 - by 1-blue
  useEffect(() => {
    if (data?.ok) {
      router.push(`/streams/${data.stream.id}`);
      toast.success(data.message);
    }
  }, [data, router]);

  return (
    <form onSubmit={handleSubmit(onValid)} className="px-4 space-y-4">
      {/* title */}
      <div>
        <label htmlFor="title" className="font-medium text-sm cursor-pointer">
          제목
        </label>
        <div className="mb-4">
          <Input
            register={register("title", { required: true, maxLength: 40 })}
            id="title"
            type="text"
            placeholder="제목을 입력해주세요"
          />
          {errors.title ? (
            <Notice $error text="40자 이하로 입력해주세요." />
          ) : (
            <Notice $success text="40자 이하로 입력해주세요." />
          )}
        </div>
      </div>

      {/* price */}
      <div>
        <label htmlFor="price" className="font-medium text-sm cursor-pointer">
          가격
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-2 text-sm select-none">₩</span>
          <Input
            register={register("price", {
              required: true,
              valueAsNumber: true,
            })}
            id="price"
            type="number"
            placeholder="1000"
            className="pl-6 pr-8"
          />
          <span className="absolute right-2 text-gray-500 font-medium select-none">
            원
          </span>
        </div>
        {errors.price ? (
          <Notice $error text="값을 입력해주세요." />
        ) : (
          <Notice $success text="값을 입력해주세요." />
        )}
      </div>

      {/* description */}
      <div>
        <label
          htmlFor="description"
          className="font-medium text-sm cursor-pointer"
        >
          설명
        </label>
        <div className="mb-4">
          <Textarea
            register={register("description", { required: true })}
            id="description"
            rows={6}
          />
          {errors.description ? (
            <Notice $error text="값을 입력해주세요." />
          ) : (
            <Notice $success text="값을 입력해주세요." />
          )}
        </div>
      </div>
      <Button
        type="submit"
        $loading={loading}
        $primary
        className="w-full"
        text="Go Live"
      />
    </form>
  );
};

export default Create;
