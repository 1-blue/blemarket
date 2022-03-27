import Link from "next/link";

interface IProps {
  id: number | undefined;
  name: string | undefined;
  avatar: string | undefined;
}

const Profile = ({ id, name }: IProps) => {
  return (
    <Link href={`/users/profiles/${id}`}>
      <a className="flex items-center border-y py-4 px-2 space-x-2 cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:rounded-md">
        <div className="w-14 h-14 rounded-full bg-slate-300" />
        <div>
          <p className="font-semibold">{name}</p>
          <span className="text-xs font-semibold text-gray-500">
            View profile &rarr;
          </span>
        </div>
      </a>
    </Link>
  );
};

export default Profile;
