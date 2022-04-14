import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// type
import { ApiResponse, ICON_SHAPE } from "@src/types";

// utils
import { combineClassNames } from "@src/libs/client/util";

// common-component
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Notice from "@src/components/common/Notice";
import Icon from "@src/components/common/Icon";
import HeadInfo from "@src/components/common/HeadInfo";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useResponseToast from "@src/libs/hooks/useResponseToast";
import useUser from "@src/libs/hooks/useUser";

type EnterForm = {
  email?: string;
  phone?: string;
};
type TokenForm = {
  token: string;
};
enum LOGIN_TYPE {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

const Enter = () => {
  const { userMutate } = useUser();

  // 2022/04/13 - email or phone으로 유저 생성 - by 1-blue
  const [createUser, { loading: createUserLoading, data: createUserResponse }] =
    useMutation<ApiResponse>("/api/users/enter");
  // 022/04/13 - 인증을 위한 토큰값 입력 - by 1-blue
  const [
    tokenConfirm,
    { loading: tokenConfirmLoading, data: tokenConfirmResponse },
  ] = useMutation<ApiResponse>("/api/users/confirm");
  // 2022/04/13 - 유저 생성 form - by 1-blue
  const {
    register: enterRegister,
    handleSubmit: enterHandleSubmit,
    reset: enterReset,
    formState: { errors: enterErrors },
  } = useForm<EnterForm>({ mode: "onChange" });
  // 2022/04/13 - 토큰 form - by 1-blue
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
    useForm<TokenForm>();
  // 2022/04/13 - 로그인 방식 - by 1-blue
  const [method, setMethod] = useState<LOGIN_TYPE>(LOGIN_TYPE.EMAIL);

  // 2022/03/17 - 로그인 방식 변경 - by 1-blue
  const onClickEmail = useCallback(() => {
    enterReset();
    setMethod(LOGIN_TYPE.EMAIL);
  }, [enterReset]);
  const onClickPhone = useCallback(() => {
    enterReset();
    setMethod(LOGIN_TYPE.PHONE);
  }, [enterReset]);

  // 2022/03/21 - 로그인 이벤트 - by 1-blue
  const onEnterValid = useCallback(
    (body: EnterForm) => createUser(body),
    [createUser]
  );
  // 2022/03/24 - 인증 이벤트 - by 1-blue
  const onTokenValid = useCallback(
    (body: TokenForm) => tokenConfirm(body),
    [tokenConfirm]
  );
  // 2022/03/24 - 로그인 완료 시 페이지 이동 - by 1-blue
  useResponseToast({
    response: tokenConfirmResponse,
    successMessage: "로그인에 성공했습니다.\n메인 페이지로 이동합니다.",
    errorMessage: "토큰이 일치하지 않습니다.",
    move: "/",
  });

  return (
    <article>
      <HeadInfo
        title="blemarket | Enter"
        description="blemarket의 로그인 페이지입니다. 😄"
        photo={null}
      />

      {/* title/sub-title */}
      <section>
        <h3 className="font-bold text-2xl text-center mb-4">
          Blemarket 회원가입
        </h3>
        <h5 className="text-gray-600 font-semibold text-center">
          회원가입 방식 선택
        </h5>
      </section>

      {/* login ( email or phone / token ) */}
      <section>
        {createUserResponse?.ok ? (
          <form onSubmit={tokenHandleSubmit(onTokenValid)} className="mb-8">
            <label className="text-sm text-gray-600 font-semibold">
              토큰 확인
            </label>
            <div className="mb-4">
              <Input
                register={tokenRegister("token")}
                type="text"
                placeholder="ex) 96012"
              />
              {tokenConfirmResponse?.ok === false && (
                <Notice text="토큰이 일치하지 않습니다." $error />
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              text="Confirm Token"
              $primary
              $loading={tokenConfirmLoading}
            />
          </form>
        ) : (
          <>
            <div className="grid grid-cols-2 border-b-2 mb-4">
              <button
                type="button"
                onClick={onClickEmail}
                className={combineClassNames(
                  "p-4",
                  method === LOGIN_TYPE.EMAIL
                    ? "border-b-2 border-orange-500 text-orange-400 font-semibold"
                    : ""
                )}
              >
                이메일
              </button>
              <button
                type="button"
                onClick={onClickPhone}
                className={combineClassNames(
                  "p-4",
                  method === LOGIN_TYPE.PHONE
                    ? "border-b-2 border-orange-500 text-orange-400 font-semibold"
                    : ""
                )}
              >
                휴대폰
              </button>
            </div>
            {/* submit form */}
            <form onSubmit={enterHandleSubmit(onEnterValid)} className="mb-8">
              <label className="text-sm text-gray-600 font-semibold">
                {method === LOGIN_TYPE.EMAIL && "이메일 입력"}
                {method === LOGIN_TYPE.PHONE && "휴대폰 번호 입력"}
              </label>
              <div className="mb-4 flex flex-col">
                {method === LOGIN_TYPE.EMAIL && (
                  <>
                    <Input
                      register={enterRegister("email", {
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
                    {enterErrors.email ? (
                      <Notice
                        $error
                        text="이메일의 형식에 맞게 입력해주세요."
                      />
                    ) : (
                      <Notice
                        $success
                        text="이메일의 형식에 맞게 입력해주세요."
                      />
                    )}
                  </>
                )}
                {method === LOGIN_TYPE.PHONE && (
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="py-2 px-2 border-2 border-r-0 rounded-l-md border-gray-300 font-semibold bg-gray-200 select-none">
                        +82
                      </span>
                      <Input
                        register={enterRegister("phone", {
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
                    {enterErrors.phone ? (
                      <Notice
                        $error
                        text="전화번호 형식에 맞게 입력해주세요."
                      />
                    ) : (
                      <Notice
                        $success
                        text="전화번호 형식에 맞게 입력해주세요."
                      />
                    )}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                $primary
                text={
                  method === LOGIN_TYPE.EMAIL
                    ? "Get login link"
                    : method === LOGIN_TYPE.PHONE
                    ? "Get out-time password"
                    : ""
                }
                $loading={createUserLoading}
              />
            </form>
          </>
        )}
      </section>

      {/* division line */}
      <section>
        <div className="relative">
          <div className="absolute w-full border-t border-gray-300" />
          <div className="relative -top-3 text-center ">
            <span className="bg-white px-2 text-sm text-gray-500">
              다른 회원가입 선택
            </span>
          </div>
        </div>
        {/* OAuth buttons */}
        <div className="grid grid-cols-2 mt-2 gap-3">
          <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <Icon shape={ICON_SHAPE.TWITTER} $icon />
          </button>
          <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <Icon shape={ICON_SHAPE.GITHUB} $icon />
          </button>
        </div>
      </section>
    </article>
  );
};

export default Enter;
