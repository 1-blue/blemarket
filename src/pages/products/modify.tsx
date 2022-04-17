import { useCallback, useEffect } from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useResponseToast from "@src/libs/hooks/useResponseToast";
import usePreview from "@src/libs/hooks/usePreview";
import usePermission from "@src/libs/hooks/usePermission";

// util
import prisma from "@src/libs/client/prisma";
import { combinePhotoUrl } from "@src/libs/client/util";

interface IProps extends Product {
  keywords: {
    keyword: string;
  }[];
}
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

const Upload: NextPage<IProps> = (product) => {
  const router = useRouter();
  const { productId } = router.query;

  // 2022/04/13 - 상품 정보 form - by 1-blue
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UploadForm>({ mode: "onBlur" });
  // 2022/04/17 - 기존 상품 데이터 주입 - by 1-blue
  useEffect(() => {
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue(
      "keywords",
      product.keywords.map((keyword) => keyword.keyword).join(" ")
    );
  }, [product, setValue]);

  // 2022/04/13 - 상품 업로드 메서드 - by 1-blue
  const [modifyProduct, { data, loading }] = useMutation<IProductResponse>(
    `/api/products/${productId}`,
    "PATCH"
  );

  // 2022/03/25 - 상품 수정 - by 1-blue
  const onModifyProduct = useCallback(
    async ({ photo, name, price, description, keywords }: UploadForm) => {
      if (loading)
        return toast.warning("현재 처리중입니다. 잠시만 기다려주세요!");

      // 상품 이미지도 같이 등록
      if (photo && photo.length > 0) {
        // 상품 이미지 크기 1MB초과인지 판단
        if (photo[0].size > 1024 * 1024) {
          // 이미지 없이 등록
          if (confirm("이미지없이 상품을 등록하시겠습니까?")) {
            return modifyProduct({ name, price, description, keywords });
          }
        }

        const formData = new FormData();
        formData.append("photo", photo?.[0]!);
        const { photo: image } = await await fetch("/api/photo", {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        return modifyProduct({
          photo: image,
          name,
          price,
          description,
          keywords,
        });
      }
      // 이미지 수정 X
      return modifyProduct({
        name,
        price,
        description,
        keywords,
        photo: product.image,
      });
    },
    [loading, modifyProduct, product]
  );

  // 2022/03/25 - 상품 업로드 완료 후 리다이렉트 - by 1-blue
  useResponseToast({
    response: data,
    successMessage: "상품을 수정했습니다!",
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

  // 2022/04/17 - 접근 권한 확인 - by 1-blue
  usePermission({
    userId: product.userId,
    message: "접근 권한이 없습니다.",
    move: "/",
  });

  return (
    <>
      <HeadInfo
        title={`blemarket | Modify-Product`}
        description="상품 수정 페이지입니다. 😄"
        photo={null}
      />

      <article>
        <form onSubmit={handleSubmit(onModifyProduct)}>
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
                  <>
                    {product.image ? (
                      <figure className="relative w-full h-full bg-black rounded-md">
                        <Image
                          src={combinePhotoUrl(product.image)}
                          alt="상품 이미지 미리보기"
                          layout="fill"
                          className="object-contain"
                        />
                      </figure>
                    ) : (
                      <Icon shape={ICON_SHAPE.PHOTO} width={48} height={48} />
                    )}
                  </>
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
                  maxLength: 40,
                })}
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
      </article>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const productId = Number(context.query?.productId);

  // 특정 상품과 작성자 찾기
  const foundProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      keywords: {
        select: {
          keyword: true,
        },
      },
    },
  });

  return {
    props: {
      ...JSON.parse(JSON.stringify(foundProduct)),
    },
  };
};

export default Upload;
