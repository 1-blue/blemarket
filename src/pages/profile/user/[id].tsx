import { useCallback, useEffect, useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser, IReviewForm } from "@src/types";
import { Review } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import UserProfile from "@src/components/common/Profile";
import UserReview from "@src/components/Review";
import Textarea from "@src/components/common/Textarea";
import Button from "@src/components/common/Button";
import HeadInfo from "@src/components/common/HeadInfo";

// util
import prisma from "@src/libs/client/prisma";
import { combineClassNames } from "@src/libs/client/util";

// hook
import useUser from "@src/libs/hooks/useUser";
import useMutation from "@src/libs/hooks/useMutation";

interface IReviewWithWriter extends Review {
  createdBy: SimpleUser;
}

interface IReviewResponse extends ApiResponse {
  reviews: IReviewWithWriter[];
}
interface ICreateReviewResponse extends ApiResponse {
  createdReview: IReviewWithWriter;
}

interface IUserResponse extends ApiResponse {
  user: {
    id: number;
    name: string;
    avatar: string;
    _count: {
      receivedReviews: number;
    };
  };
}

const Profile: NextPage<IUserResponse> = ({ user }) => {
  const router = useRouter();
  const { user: me } = useUser();
  // 별
  const [score, setScore] = useState(1);
  // 리뷰 토글
  const [toggleReview, setToggleReview] = useState(true);

  const [offset] = useState(5);

  // 2022/04/11 - 댓글들 순차적 요청 - by 1-blue
  const {
    data: reviewsResponse,
    size,
    setSize,
    mutate: reviewMutate,
  } = useSWRInfinite<IReviewResponse>(
    router.query.id
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.reviews.length) return null;
          return `/api/users/${router.query.id}/reviews?page=${pageIndex}&offset=${offset}`;
        }
      : () => null
  );
  // 리뷰 생성
  const [createReview, { data: createdReviewResponse, loading }] =
    useMutation<ICreateReviewResponse>(`/api/users/${router.query.id}/reviews`);
  // 리뷰 입력
  const { register, handleSubmit, reset } = useForm<IReviewForm>();
  // 2022/04/11 - 리뷰 제출 - by 1-blue
  const onSubmitReview = useCallback(
    ({ review }: IReviewForm) => {
      if (loading) return;
      createReview({ score, review });

      reset();
    },
    [createReview, loading, reset, score]
  );
  // 2022/04/11 - 리뷰 생성 성공 시 데이터 넣어주기 - by 1-blue
  useEffect(() => {
    if (!createdReviewResponse?.ok) return;
    if (!createdReviewResponse.createdReview) return;

    reviewMutate(
      (prev) =>
        prev && [
          ...prev,
          {
            ok: true,
            message: "mutate로 리뷰 추가",
            reviews: [createdReviewResponse.createdReview],
          },
        ],
      false
    );
  }, [reviewMutate, createdReviewResponse]);

  return (
    <>
      <HeadInfo
        title={`blemarket | ${user.name}님의 프로필`}
        description={`blemarket의 ${user.name}님의 프로필 페이지입니다. 😄`}
        photo={user.avatar}
      />

      {/* 프로필 or 수정 버튼 */}
      <article>
        {me?.id === user.id ? (
          <UserProfile user={user} href={"/profile/edit"} />
        ) : (
          <UserProfile user={user} />
        )}
      </article>

      {/* 판매내역, 구매내역, 관심목록 */}
      {me?.id === user.id && (
        <article>
          <ul className="flex justify-around items-center pt-4">
            <li>
              <Link href="/profile/sale">
                <a className="flex-1 group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-8 focus:rounded-sm">
                  <div className="flex justify-center items-center bg-orange-400 w-16 h-16 rounded-full text-white mb-2 group-hover:bg-orange-500 ">
                    <Icon shape={ICON_SHAPE.CART} />
                  </div>
                  <span className="text-gray-700 font-medium">판매내역</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/profile/purchase">
                <a className="flex-1 group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-8 focus:rounded-sm">
                  <div className="flex justify-center items-center bg-orange-400 w-16 h-16 rounded-full text-white mb-2 group-hover:bg-orange-500">
                    <Icon shape={ICON_SHAPE.BAG} />
                  </div>
                  <span>구매내역</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/profile/favorite">
                <a className="flex-1 group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-8 focus:rounded-sm">
                  <div className="flex justify-center items-center bg-orange-400 w-16 h-16 rounded-full text-white mb-2 group-hover:bg-orange-500">
                    <Icon shape={ICON_SHAPE.HEART} />
                  </div>
                  <span>관심목록</span>
                </a>
              </Link>
            </li>
          </ul>
          <br />
          <hr />
          <br />
        </article>
      )}

      {/* 리뷰 */}
      <article className="mb-6">
        <button type="button" onClick={() => setToggleReview((prev) => !prev)}>
          거래 후기 ( {user._count.receivedReviews}개 )
        </button>
        {toggleReview && (
          <>
            <ul className="divide-y-2 space-y-4">
              {reviewsResponse?.map((reviews) =>
                reviews.reviews.map((review) => (
                  <UserReview key={review.id} review={review} />
                ))
              )}
            </ul>

            <section className="mt-6">
              {Math.ceil(user._count.receivedReviews / offset) > size ? (
                <Button
                  onClick={() => setSize((prev) => prev + 1)}
                  text={`리뷰 ${
                    user._count.receivedReviews - offset * size
                  }개 더 불러오기`}
                  $primary
                  className="block mx-auto px-4"
                  $loading={typeof reviewsResponse?.[size - 1] === "undefined"}
                />
              ) : (
                <span className="block text-center text-sm font-semibold my-2">
                  더 이상 불러올 리뷰가 존재하지 않습니다.
                </span>
              )}
            </section>
          </>
        )}
      </article>

      <hr className="border my-8" />

      {me?.id !== user.id && (
        <article>
          <div className="flex">
            {Array(5)
              .fill(null)
              .map((_, i) => i + 1)
              .map((v) => (
                <Icon
                  key={v}
                  shape={ICON_SHAPE.STAR}
                  $fill
                  className={combineClassNames(
                    "w-8 h-8",
                    v > score ? "text-gray-400" : "text-yellow-400"
                  )}
                  onClick={() => setScore(v)}
                />
              ))}
          </div>
          <form onSubmit={handleSubmit(onSubmitReview)}>
            <Textarea
              register={register("review")}
              placeholder="리뷰를 입력해주세요"
            />
            <Button text="리뷰 작성" $primary className="w-full" />
          </form>
        </article>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async (context) => {
  const userId = Number(context.params?.id);

  const exUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      _count: {
        select: {
          receivedReviews: true,
        },
      },
    },
  });

  return {
    props: {
      ok: true,
      message: "특정 유저의 정보입니다.",
      user: exUser,
    },
    revalidate: 60 * 10,
  };
};

export default Profile;
