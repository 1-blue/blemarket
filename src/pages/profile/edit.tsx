import React, { useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// common-component
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Notice from "@src/components/common/Notice";

// type
import { ApiResponse, IUpdateForm } from "@src/types";

// hook
import useUser from "@src/libs/client/useUser";
import useMutation from "@src/libs/client/useMutation";

const ProfileEdit: NextPage = () => {
  const { user, loading: userLoading } = useUser();
  const [updateProfile, { data, loading }] =
    useMutation<ApiResponse>("/api/users/me");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IUpdateForm>({ mode: "onChange" });

  // 2022/03/31 - 유저의 본래 정보 기입 - by 1-blue
  useEffect(() => {
    setValue("name", user?.name);
    setValue("email", user?.email);
    setValue("phone", user?.phone);
  }, [setValue, user]);

  // 2022/03/31 - 프로필 업데이트 - 1-blue
  const onValid = useCallback(
    (body: IUpdateForm) => {
      if (loading) return toast.error("이미 처리중입니다.");

      updateProfile(body);
    },
    [loading, updateProfile]
  );

  useEffect(() => {
    if (data && !data.ok) {
      toast.error(data.message);
    } else if (data && data.ok) {
      toast.success("정보를 변경했습니다! 🐲");
    }
  }, [data]);

  return (
    <form className="px-4 space-y-4" onSubmit={handleSubmit(onValid)}>
      {/* 프로필 이미지 */}
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-full bg-slate-500" />
        <label
          htmlFor="picture"
          className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
        >
          Change
          <input id="picture" type="file" className="hidden" accept="image/*" />
        </label>
      </div>

      {/* 이름 */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          이름
        </label>
        <Input
          id="name"
          register={register("name", {
            required: true,
            minLength: {
              value: 1,
              message: "한 글자 이상 입력해주세요.",
            },
          })}
          type="text"
          placeholder="ex) 관리자"
        />
        {errors.name ? (
          <Notice $error text="한 글자 이상 입력해주세요." />
        ) : (
          <Notice $success text="한 글자 이상 입력해주세요." />
        )}
      </div>

      {/* 이메일 */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          id="email"
          register={register("email", {
            required: true,
            pattern: {
              value:
                /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
              message: "이메일의 형식에 맞게 입력해주세요.",
            },
          })}
          type="email"
          placeholder="ex) 1-blue98@naver.com"
        />
        {errors.email ? (
          <Notice $error text="이메일의 형식에 맞게 입력해주세요." />
        ) : (
          <Notice $success text="이메일의 형식에 맞게 입력해주세요." />
        )}
      </div>

      {/* 휴대폰 */}
      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone number
        </label>
        <div className="flex rounded-md shadow-sm">
          <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
            +82
          </span>
          <Input
            id="phone"
            register={register("phone", {
              required: true,
              pattern: {
                value: /^010(\d){8}/,
                message: "전화번호 형식에 맞게 입력해주세요.",
              },
              maxLength: 11,
            })}
            type="number"
            placeholder="ex) 01021038259"
            className="rounded-l-none"
          />
        </div>
        {errors.phone ? (
          <Notice $error text="전화번호 형식에 맞게 입력해주세요." />
        ) : (
          <Notice $success text="전화번호 형식에 맞게 입력해주세요." />
        )}
      </div>
      {/* 버튼 */}
      <Button
        text="Update profile"
        $primary
        className="w-full"
        type="submit"
        $loading={userLoading || loading}
      />
    </form>
  );
};

export default ProfileEdit;
