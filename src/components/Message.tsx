import { combineClassNames } from "@src/libs/client/util";

interface IProps {
  userName: string;
  message: string;
  updatedAt: Date;
  $reversed?: boolean;
}

const Message = ({ userName, message, updatedAt, $reversed }: IProps) => {
  return (
    <div
      className={combineClassNames(
        "flex space-x-2",
        $reversed ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      {/* 프사 */}
      <div className="w-12 h-12 rounded-full bg-slate-400 flex-shrink-0" />
      {/* 유저명과 채팅내용 */}
      <div
        className={combineClassNames(
          "flex flex-col flex-grow-0",
          $reversed ? "items-end" : ""
        )}
      >
        <span className="text-sm">{userName}</span>
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
