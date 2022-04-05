import { useCallback } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";

// type
import { ICON_SHAPE, ApiResponse, IUploadForm } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Notice from "@src/components/common/Notice";
import Textarea from "@src/components/common/Textarea";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useResponseToast from "@src/libs/hooks/useResponseToast";

interface IProductResponse extends ApiResponse {
  product: Product;
}

const Upload: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUploadForm>({ mode: "onBlur" });
  // 상품 업로드 메서드
  const [upload, { data, loading }] =
    useMutation<IProductResponse>("/api/products");

  // 2022/03/25 - upload form 제출 - by 1-blue
  const onValid = useCallback((data: IUploadForm) => upload(data), [upload]);

  // 2022/03/25 - 상품 업로드 완료 후 리다이렉트 - by 1-blue
  useResponseToast({
    response: data,
    successMessage: "상품을 등록했습니다!",
    move: data?.product.id ? `/products/${data.product.id}` : "",
  });

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <ul className="px-4 space-y-4">
        {/* 상품 이미지 */}
        <li>
          <label
            id="image-input"
            className="flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-400 text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer rounded-md"
          >
            <Icon shape={ICON_SHAPE.PHOTO} width={48} height={48} />
            <input name="image-input" type="file" hidden />
          </label>
        </li>
        {/* 상품 이름 */}
        <li>
          <label htmlFor="name" className="font-medium text-sm cursor-pointer">
            제목
          </label>
          <Input
            id="name"
            type="text"
            register={register("name", { required: true, maxLength: 30 })}
          />
          {errors.name ? (
            <Notice $error text="30자 이하로 입력해주세요" />
          ) : (
            <Notice $success text="30자 이하로 입력해주세요" />
          )}
        </li>
        {/* 상품 가격 */}
        <li>
          <label htmlFor="price" className="font-medium text-sm cursor-pointer">
            가격
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-2 text-sm select-none">₩</span>
            <Input
              id="price"
              type="number"
              placeholder="10000"
              register={register("price", { required: true })}
              className="pl-6 pr-12"
            />
            <span className="absolute right-2 text-gray-500 font-medium select-none">
              원
            </span>
          </div>
        </li>
        {/* 상품 설명 */}
        <li>
          <label
            htmlFor="description"
            className="font-medium text-sm cursor-pointer"
          >
            설명
          </label>
          <Textarea
            id="description"
            rows={6}
            register={register("description", { required: true })}
            className="appearance-none w-full border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-500 focus:ring-0 text-sm resize-none"
          />
        </li>
        {/* 상품 키워드 */}
        <li>
          <label
            htmlFor="keywords"
            className="font-medium text-sm cursor-pointer"
          >
            연관 상품 및 검색 키워드 입력
          </label>
          <Input
            id="keywords"
            type="text"
            register={register("keywords", { required: true, maxLength: 40 })}
          />
          {errors.keywords ? (
            <Notice
              $error
              text="40자 이하로 공백을 기준으로 분리해서 입력해주세요"
            />
          ) : (
            <Notice
              $success
              text="40자 이하로 공백을 기준으로 분리해서 입력해주세요"
            />
          )}
        </li>
        {/* 상품 등록 버튼 */}
        <li>
          <Button
            type="submit"
            text="상품 등록"
            $primary
            $loading={loading}
            className="w-full"
          />
        </li>
      </ul>
    </form>
  );
};

export default Upload;
