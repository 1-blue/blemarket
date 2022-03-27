import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

// type
import { ICON_SHAPE, IMutationResult } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";

// component
import SideButton from "@src/components/SideButton";
import CommunityItem from "@src/components/CommunityItem";

export interface IPostWithEtc extends Post {
  user: {
    name: string;
  };
  _count: {
    answers: number;
    recommendations: number;
  };
}

interface IPostResponse extends IMutationResult {
  posts: IPostWithEtc[];
}

const Community: NextPage = () => {
  const { data } = useSWR<IPostResponse>("/api/posts");

  return (
    <div className="px-4 space-y-8">
      <ul className="space-y-8">
        {data?.posts.map((post) => (
          <li key={post.id}>
            <CommunityItem post={post} />
          </li>
        ))}
      </ul>

      <Link href="/community/write">
        <a>
          <SideButton>
            <Icon shape={ICON_SHAPE.PENCIL} />
          </SideButton>
        </a>
      </Link>
    </div>
  );
};

export default Community;
