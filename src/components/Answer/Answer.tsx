// type
import { SimpleUser } from "@src/types";

// common-component
import Avatar from "@src/components/common/Avatar";

// util
import { timeFormat } from "@src/libs/client/dateFormat";

interface AnswerWithUser {
  id: number;
  answer: string;
  updatedAt: Date | number;
  user: SimpleUser;
}

const Answer = ({ answer }: { answer: AnswerWithUser }) => {
  return (
    <li className="px-4 my-5 space-y-5">
      <div className="flex items-start space-x-3">
        <Avatar user={answer.user} className="w-10 h-10" />
        <div>
          <span className="text-sm block font-medium text-gray-700">
            {answer.user.name}
          </span>
          <span className="text-xs text-gray-500 block ">
            {timeFormat(answer.updatedAt!)}
          </span>
          <p className="text-gray-700 mt-2 whitespace-pre">{answer.answer}</p>
        </div>
      </div>
    </li>
  );
};

export default Answer;
