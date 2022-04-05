// type
import { SimpleUser } from "@src/types";

// common-component
import Avatar from "@src/components/common/Avatar";

// util
import { combineClassNames } from "@src/libs/client/util";
import { timeFormat } from "@src/libs/client/dateFormat";

interface IProps {
  message: string;
  updatedAt: Date;
  user: SimpleUser;
  $reversed?: boolean;
}

const Message = ({ message, updatedAt, user, $reversed }: IProps) => {
  return (
    <li
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
        <p className="border-2 bg-orange-400 text-white rounded-md px-4 py-2 max-w-[240px]">
          {message}
        </p>
      </div>
      {/* 채팅 작성 시간 */}
      <span className="text-sm text-gray-500 self-end text-right">
        {timeFormat(updatedAt)}
      </span>
    </li>
  );
};

export default Message;
