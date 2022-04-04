import Link from "next/link";

// util
import Avatar from "./Avatar";
import { SimpleUser } from "@src/types";

interface IProps {
  user: SimpleUser;
}

const Profile = ({ user }: IProps) => {
  return (
    <Link href={`/users/profiles/${user.id}`}>
      <a className="flex items-center border-y py-4 px-2 space-x-2 cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:rounded-md">
        <Avatar user={user} />
        <div>
          <p className="font-semibold">{user.name}</p>
          <span className="text-xs font-semibold text-gray-500">
            View profile &rarr;
          </span>
        </div>
      </a>
    </Link>
  );
};

export default Profile;
