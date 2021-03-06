import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse } from "@src/types";
import { Product } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";
import Input from "@src/components/common/Input";
import Notice from "@src/components/common/Notice";
import Textarea from "@src/components/common/Textarea";
import HeadInfo from "@src/components/common/HeadInfo";
import Spinner from "@src/components/common/Spinner";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useResponseToast from "@src/libs/hooks/useResponseToast";
import usePreview from "@src/libs/hooks/usePreview";

interface IProductResponse extends ApiResponse {
  product: Product;
}
type UploadForm = {
  photo?: FileList;
  name: string;
  price: number;
  description: string;
  keywords: string;
};

const Upload: NextPage = () => {
  // 2022/04/13 - 상품 정보 form - by 1-blue
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UploadForm>({ mode: "onBlur" });
  // 2022/04/13 - 상품 업로드 메서드 - by 1-blue
  const [uploadProuct, { data, loading }] =
    useMutation<IProductResponse>("/api/products");
  // 2022/04/23 - 상품 이미지 업로드 로딩 변수 - by 1-blue
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);

  // 2022/03/25 - 상품 생성 - by 1-blue
  const onCreateProduct = useCallback(
    async ({ photo, name, price, description, keywords }: UploadForm) => {
      // 상품 이미지도 같이 등록
      if (photo && photo.length > 0) {
        // 상품 이미지 크기 1MB초과인지 판단
        if (photo[0].size > 1024 * 1024) {
          // 이미지 없이 등록
          if (confirm("이미지없이 상품을 등록하시겠습니까?")) {
            return uploadProuct({ name, price, description, keywords });
          }
        }

        setPhotoUploadLoading(true);
        const formData = new FormData();
        formData.append("photo", photo?.[0]!);
        const { photo: image } = await await fetch("/api/photo", {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
        setPhotoUploadLoading(false);

        return uploadProuct({
          photo: image,
          name,
          price,
          description,
          keywords,
        });
      }
      // 상품 이미지 없이 등록
      if (confirm("이미지없이 상품을 등록하시겠습니까?")) {
        return uploadProuct({ name, price, description, keywords });
      }
    },
    [uploadProuct, setPhotoUploadLoading]
  );

  // 2022/03/25 - 상품 업로드 완료 후 리다이렉트 - by 1-blue
  useResponseToast({
    response: data,
    successMessage: "상품을 등록했습니다!",
    move: data?.product.id ? `/products/${data.product.id}` : "",
  });

  // 2022/04/06 - 상품 이미지 미리보기 - by 1-blue
  const watchPhoto = watch("photo");
  const [photoPreview, setPhotoPreview] = usePreview(watchPhoto);

  // 2022/04/13 - 상품 이미지 용량 제한 - by 1-blue
  useEffect(() => {
    if (
      watchPhoto &&
      watchPhoto.length > 0 &&
      watchPhoto[0].size > 1024 * 1024
    ) {
      toast.error("1MB가 넘는 이미지는 업로드할 수 없습니다!");
      setPhotoPreview("");
    }
  }, [watchPhoto, setPhotoPreview]);

  return (
    <>
      <HeadInfo
        title={`blemarket | Upload-Product`}
        description="상품 등록 페이지입니다. 😄"
        photo={null}
      />

      <article>
        <form onSubmit={handleSubmit(onCreateProduct)}>
          <ul className="px-4 space-y-4">
            {/* 상품 이미지 */}
            <li>
              <label
                id="photo"
                className="flex justify-center items-center w-full h-60 p-1 border-2 border-dashed border-gray-400 text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer rounded-md"
              >
                {photoPreview ? (
                  <figure className="relative w-full h-full bg-black rounded-md">
                    <Image
                      src={photoPreview}
                      alt="상품 이미지 미리보기"
                      layout="fill"
                      className="object-contain"
                    />
                  </figure>
                ) : (
                  <Icon shape={ICON_SHAPE.PHOTO} width={48} height={48} />
                )}
                <input type="file" hidden {...register("photo")} />
              </label>
            </li>
            {/* 상품 이름 */}
            <li>
              <label
                htmlFor="name"
                className="font-medium text-sm cursor-pointer"
              >
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
              <label
                htmlFor="price"
                className="font-medium text-sm cursor-pointer"
              >
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
                register={register("keywords", {
                  required: true,
                })}
              />
              {errors.keywords ? (
                <Notice $error text="공백을 기준으로 분리해서 입력해주세요" />
              ) : (
                <Notice $success text="공백을 기준으로 분리해서 입력해주세요" />
              )}
            </li>
            {/* 상품 등록 버튼 */}
            <li>
              <Button
                type="submit"
                text="상품 등록"
                $primary
                $loading={loading || photoUploadLoading}
                className="w-full"
              />
            </li>
          </ul>
        </form>
      </article>

      {(photoUploadLoading || loading) && <Spinner kinds="page" />}
    </>
  );
};

export default Upload;
