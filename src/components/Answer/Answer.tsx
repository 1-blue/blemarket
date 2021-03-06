import { Dispatch, SetStateAction } from "react";

// type
import { ICON_SHAPE, SimpleUser } from "@src/types";

// common-component
import Avatar from "@src/components/common/Avatar";
import Icon from "@src/components/common/Icon";

// util
import { timeFormat } from "@src/libs/client/dateFormat";

// hook
import useMe from "@src/libs/hooks/useMe";

interface AnswerWithUser {
  id: number;
  answer: string;
  updatedAt: Date | number;
  user: SimpleUser;
}
type Props = {
  answer: AnswerWithUser;
  setToggleModal: Dispatch<SetStateAction<boolean>>;
  setToRemoveAnswerId: Dispatch<SetStateAction<number | null>>;
};

const Answer = ({ answer, setToggleModal, setToRemoveAnswerId }: Props) => {
  const { me } = useMe();

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
        <div className="flex-1" />
        {answer.user.id === me?.id && (
          <button
            type="button"
            className="rounded-full hover:bg-gray-200 hover:text-orange-500 p-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:text-orange-500 transition-colors"
            onClick={() => {
              setToggleModal(true);
              setToRemoveAnswerId(answer.id);
            }}
          >
            <Icon shape={ICON_SHAPE.DOTS_H} />
          </button>
        )}
      </div>
    </li>
  );
};

export default Answer;
