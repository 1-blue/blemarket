import Link from "next/link";

// type
import { SimpleUser } from "@src/types";

// common-component
import Avatar from "@src/components/common/Avatar";

interface IProps {
  user: SimpleUser;
  href?: string;
}

const Profile = ({ user, href }: IProps) => {
  return (
    <Link href={href ? href : `/profile/user/${user?.id}`}>
      <a className="flex items-center border-y py-4 px-2 space-x-2 cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:rounded-md">
        <Avatar user={user} />
        <div>
          <p className="font-semibold">{user?.name}</p>
          <span className="text-xs font-semibold text-gray-500">
            {href ? "Edit " : "View "} profile &rarr;
          </span>
        </div>
      </a>
    </Link>
  );
};

export default Profile;
