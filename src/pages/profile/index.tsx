import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Review, User } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import UserProfile from "@src/components/common/Profile";
import UserReview from "@src/components/Review";

interface IReviewWithWriter extends Review {
  createdBy: SimpleUser;
}

interface IReviewResponse extends ApiResponse {
  reviews: IReviewWithWriter[];
}

interface IMeResponse extends ApiResponse {
  user: User;
}

const Profile: NextPage = () => {
  const { data: reviews } = useSWR<IReviewResponse>("/api/reviews");
  const { data: me } = useSWR<IMeResponse>("/api/users/me");
  const user: SimpleUser = {
    id: me?.user.id!,
    name: me?.user.name!,
    avatar: me?.user.avatar!,
  };

  return (
    <div className="px-4 divide-y-2 space-y-4">
      <UserProfile user={user} />
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
      <ul>
        {reviews?.reviews.map((review) => (
          <UserReview key={review.id} review={review} />
        ))}
      </ul>
    </div>
  );
};

export default Profile;
