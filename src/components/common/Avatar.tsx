import Image from "next/image";

// type
import { SimpleUser } from "@src/types";
import { User } from "@prisma/client";

// util
import { combineClassNames, combinePhotoUrl } from "@src/libs/client/util";

interface IProps {
  user?: SimpleUser | User;
  className?: string;
}

const Avatar = ({ user, className }: IProps) => {
  return (
    <>
      {user?.avatar ? (
        <figure
          className={combineClassNames(
            "relative w-12 h-12",
            className ? className : ""
          )}
        >
          <Image
            src={combinePhotoUrl(user?.avatar)}
            layout="fill"
            className="rounded-full object-cover"
            alt={`${user?.name}님의 프로필 이미지`}
          />
        </figure>
      ) : (
        <figure
          className={combineClassNames(
            "w-12 h-12 rounded-full bg-slate-400",
            className ? className : ""
          )}
        />
      )}
    </>
  );
};

export default Avatar;
