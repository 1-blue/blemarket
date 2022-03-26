import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

// type
import {
  IEnterForm,
  IMutationResult,
  ITokenForm,
  LOGIN_TYPE,
} from "@src/types";

// utils
import { combineClassNames } from "@src/libs/client/util";
import useMutation from "@src/libs/client/useMutation";

// common-component
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Notice from "@src/components/common/Notice";

const Enter = () => {
  const router = useRouter();
  const [enter, { loading: enterLoading, data: enterData, error: enterError }] =
    useMutation<IMutationResult>("/api/users/enter");
  const {
    register: enterRegister,
    handleSubmit: enterHandleSubmit,
    reset: enterReset,
    formState: { errors: enterErrors },
  } = useForm<IEnterForm>({ mode: "onChange" });
  const [token, { loading: tokenLoading, data: tokenData, error: tokenError }] =
    useMutation<IMutationResult>("/api/users/confirm");
  const {
    register: tokenRegister,
    handleSubmit: tokenHandleSubmit,
    reset: tokenReset,
  } = useForm<ITokenForm>();
  const [method, setMethod] = useState<LOGIN_TYPE>(LOGIN_TYPE.EMAIL);

  // 2022/03/17 - 로그인 타입 이메일/휴대폰으로 변경 - by 1-blue
  const onClickEmail = useCallback(() => {
    enterReset();
    setMethod(LOGIN_TYPE.EMAIL);
  }, [enterReset]);
  const onClickPhone = useCallback(() => {
    enterReset();
    setMethod(LOGIN_TYPE.PHONE);
  }, [enterReset]);

  // 2022/03/21 - 로그인 이벤트 - by 1-blue
  const onEnterValid = useCallback((body: IEnterForm) => enter(body), [enter]);

  // 2022/03/24 - 인증 이벤트 - by 1-blue
  const onTokenValid = useCallback((body: ITokenForm) => token(body), [token]);

  // 2022/03/24 - 로그인 완료 시 페이지 이동 - by 1-blue
  useEffect(() => {
    if (tokenData?.ok) router.push("/");
  }, [router, tokenData]);

  return (
    <>
      {/* title */}
      <h3 className="font-bold text-2xl text-center mb-4">Enter to Blemeket</h3>
      {/* sub-title */}
      <h5 className="text-gray-600 font-semibold text-center">Enter using:</h5>

      {/* login ( email or phone / token ) */}
      {enterData?.ok ? (
        <form onSubmit={tokenHandleSubmit(onTokenValid)} className="mb-8">
          <label className="text-sm text-gray-600 font-semibold">
            Confirmation Token
          </label>
          <div className="mb-4">
            <Input
              register={tokenRegister("token")}
              type="text"
              placeholder="ex) 96012"
            />
            {tokenData?.ok === false && (
              <Notice
                text="토큰이 일치하지 않습니다. ( >> 여기는 나중에 toast로 변경할 예정 )"
                $error
              />
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            text="Confirm Token"
            $primary
            $loading={tokenLoading}
          />
        </form>
      ) : (
        <div className="px-4">
          {/* method change button */}
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
              Email Address
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
              Phone Number
            </button>
          </div>
          {/* submit form */}
          <form onSubmit={enterHandleSubmit(onEnterValid)} className="mb-8">
            <label className="text-sm text-gray-600 font-semibold">
              {method === LOGIN_TYPE.EMAIL && "Email address"}
              {method === LOGIN_TYPE.PHONE && "Phone number"}
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
                    <Notice $error text="이메일의 형식에 맞게 입력해주세요." />
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
                    <Notice $error text="전화번호 형식에 맞게 입력해주세요." />
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
              $loading={enterLoading}
            />
          </form>
        </div>
      )}

      {/* division line */}
      <div className="relative">
        <div className="absolute w-full border-t border-gray-300" />
        <div className="relative -top-3 text-center ">
          <span className="bg-white px-2 text-sm text-gray-500">
            Or enter with
          </span>
        </div>
      </div>
      {/* OAuth buttons */}
      <div className="grid grid-cols-2 mt-2 gap-3">
        <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <svg className="w-5 h-5" aria-hidden="true">
            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </button>
        <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <svg className="w-5 h-5" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Enter;
