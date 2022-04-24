import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "react-toastify";

// common-component
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Notice from "@src/components/common/Notice";
import Avatar from "@src/components/common/Avatar";
import Spinner from "@src/components/common/Spinner";

// type
import { ApiResponse } from "@src/types";

// hook
import useMe from "@src/libs/hooks/useMe";
import useMutation from "@src/libs/hooks/useMutation";
import usePreview from "@src/libs/hooks/usePreview";
import useResponseToast from "@src/libs/hooks/useResponseToast";

type UpdateForm = {
  avatar?: FileList;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
};

const ProfileEdit: NextPage = () => {
  const { me, meLoading } = useMe();

  // 2022/04/13 - 유저 정보 수정 - by 1-blue
  const [updateProfile, { data, loading: updateProfileLoading }] =
    useMutation<ApiResponse>("/api/users/me");
  // 2022/04/13 - 유저 정보 수정 폼 - by 1-blue
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UpdateForm>({ mode: "onChange" });
  // 2022/04/23 - 유저 이미지 업데이트 로딩 변수 - by 1-blue
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);

  // 2022/03/31 - 유저의 본래 정보 기입 - by 1-blue
  useEffect(() => {
    setValue("name", me?.name);
    if (me?.email) setValue("email", me.email);
    if (me?.phone) setValue("phone", me.phone);
  }, [setValue, me]);

  // 2022/03/31 - 프로필 업데이트 - 1-blue
  const onUpdateProfile = useCallback(
    async ({ avatar, email, name, phone }: UpdateForm) => {
      if (updateProfileLoading) return toast.error("이미 처리중입니다.");

      // 수정할 프로필 사진이 존재하면 실행
      if (avatar && avatar.length > 0) {
        try {
          setPhotoUploadLoading(true);
          const formData = new FormData();
          formData.append("photo", avatar?.[0]!);

          const { photo } = await await fetch("/api/photo", {
            method: "POST",
            body: formData,
          }).then((res) => res.json());
          setPhotoUploadLoading(false);

          updateProfile({
            photo,
            email,
            name,
            phone,
          });
        } catch (error) {
          return toast.error("1MB이하의 이미지를 업로드해주세요!", {
            autoClose: 4000,
          });
        }
      }
      // 수정할 프로필 사진이 없으면 실행
      else {
        updateProfile({
          email,
          name,
          phone,
        });
      }
    },
    [updateProfileLoading, updateProfile, setPhotoUploadLoading]
  );
  // 2022/04/13 - 유저 정보 변경 메시지 및 리다이렉트 - by 1-blue
  useResponseToast({
    response: data,
    successMessage: "정보를 변경했습니다!",
    move: `/profile/user/${me?.id}`,
  });
  // 2022/04/13 - 업로드할 이미지 미리보기 훅 - by 1-blue
  const [preview] = usePreview(watch("avatar"));

  if (!me) return <Spinner kinds="page" />;

  return (
    <>
      <form className="px-4 space-y-4" onSubmit={handleSubmit(onUpdateProfile)}>
        {/* 프로필 이미지 */}
        <div className="flex items-center space-x-3">
          {preview ? (
            <figure className="relative w-14 h-14">
              <Image
                src={preview}
                className="rounded-full object-cover"
                layout="fill"
                alt="업로드한 이미지"
              />
            </figure>
          ) : (
            <Avatar user={me} className="w-14 h-14" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            프로필 사진 변경
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        {/* 이름 */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            이름 입력
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
            이메일 입력
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
            휴대폰 번호 입력
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

        {/* 수정 버튼 */}
        <Button
          text="정보 수정"
          $primary
          className="w-full"
          type="submit"
          $loading={meLoading || updateProfileLoading}
        />
      </form>

      {(updateProfileLoading || photoUploadLoading) && <Spinner kinds="page" />}
    </>
  );
};

export default ProfileEdit;
