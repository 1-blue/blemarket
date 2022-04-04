// type
import { SimpleUser } from "@src/types";

// util
import { combineClassNames, combinePhotoUrl } from "@src/libs/client/util";
import Image from "next/image";
import Avatar from "./common/Avatar";

interface IProps {
  message: string;
  updatedAt: Date;
  user: SimpleUser;
  $reversed?: boolean;
}

const Message = ({ message, updatedAt, user, $reversed }: IProps) => {
  return (
    <div
      className={combineClassNames(
        "flex space-x-2",
        $reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      {/* 프사 */}
      <Avatar user={user} className="flex-shrink-0" />

      {/* 유저명과 채팅내용 */}
      <div
        className={combineClassNames(
          "flex flex-col flex-grow-0",
          $reversed ? "items-end" : ""
        )}
      >
        <span className="text-sm">{user.name}</span>
        <div className="border-2 bg-orange-400 text-white rounded-md px-4 py-2">
          {message}
        </div>
      </div>
      {/* 채팅 작성 시간 */}
      <span className="text-sm text-gray-500 self-end basis-1/4">
        {updatedAt}
      </span>
    </div>
  );
};

export default Message;
