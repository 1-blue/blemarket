import { useForm } from "react-hook-form";

// common-component
import Button from "@src/components/common/Button";
import Textarea from "@src/components/common/Textarea";

// type
import { IAnswerForm } from "@src/types";

type Props = {
  onSubmit: (body: IAnswerForm) => void;
  isLoading: boolean;
};

const AnswerForm = ({ onSubmit, isLoading }: Props) => {
  const { register, handleSubmit, reset } = useForm<IAnswerForm>();

  return (
    <article>
      <form className="px-4 my-5" onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          register={register("answer", { required: true })}
          rows={4}
          placeholder="댓글을 달아보세요!"
        />
        <Button
          type="submit"
          text="댓글 생성"
          $primary
          $loading={isLoading}
          className="w-full mt-2"
        />
      </form>
    </article>
  );
};

export default AnswerForm;
