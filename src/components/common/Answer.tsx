// type
import { SimpleUser } from "@src/types";

interface AnswerWithUser {
  id: number;
  answer: string;
  updatedAt: string;
  user: SimpleUser;
}

const Answer = ({ answer }: { answer: AnswerWithUser }) => {
  return (
    <div className="px-4 my-5 space-y-5">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
        <div>
          <span className="text-sm block font-medium text-gray-700">
            {answer.user.name}
          </span>
          <span className="text-xs text-gray-500 block ">
            {answer.updatedAt}
          </span>
          <p className="text-gray-700 mt-2 whitespace-pre">{answer.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Answer;
