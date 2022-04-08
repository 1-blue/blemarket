import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Review } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import UserProfile from "@src/components/common/Profile";
import UserReview from "@src/components/Review";

// util
import prisma from "@src/libs/client/prisma";
import HeadInfo from "@src/components/common/HeadInfo";

// hook
import useUser from "@src/libs/hooks/useUser";

interface IReviewWithWriter extends Review {
  createdBy: SimpleUser;
}

interface IReviewResponse extends ApiResponse {
  reviews: IReviewWithWriter[];
}

interface IUserResponse extends ApiResponse {
  user: SimpleUser;
}

const Profile: NextPage<IUserResponse> = ({ user }) => {
  const router = useRouter();
  const { user: me } = useUser();
  const { data: reviewsResponse } = useSWR<IReviewResponse>(
    router.query.id ? `/api/users/${router.query.id}/reviews` : null
  );

  return (
    <>
      <HeadInfo
        title={`blemarket | ${user.name}님의 프로필`}
        description={`blemarket의 ${user.name}님의 프로필 페이지입니다. 😄`}
        photo={user.avatar}
      />

      {/* 프로필 수정 버튼 */}
      {me?.id === user.id && (
        <article>
          <UserProfile user={user} href={"/profile/edit"} />
        </article>
      )}

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
      <article>
        <ul>
          {reviewsResponse?.reviews.map((review) => (
            <UserReview key={review.id} review={review} />
          ))}
        </ul>
      </article>
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
