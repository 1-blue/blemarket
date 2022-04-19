import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { toast } from "react-toastify";

// type
import { ApiResponse, IAnswerForm, SimpleUser } from "@src/types";

// component
import Answer from "@src/components/Answer/Answer";
import AnswerForm from "@src/components/Answer/AnswerForm";

// common-component
import Button from "@src/components/common/Button";
import Modal from "@src/components/common/Modal";

// hook
import useUser from "@src/libs/hooks/useUser";
import useMutation from "@src/libs/hooks/useMutation";
import useResponseToast from "@src/libs/hooks/useResponseToast";

interface IAnswerWithUser {
  id: number;
  answer: string;
  updatedAt: Date | number;
  user: SimpleUser;
}
interface IAnswerResponse extends ApiResponse {
  answers: IAnswerWithUser[];
}

type Props = {
  target: "posts" | "products";
  toggle: boolean;
  count: number;
  setToggle: Dispatch<SetStateAction<boolean>>;
};

const AnswerSection = ({ target, toggle, count, setToggle }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  // 2022/04/13 - 댓글 요청 개수 - by 1-blue
  const [offset] = useState(5);
  // 2022/04/11 - 댓글들 순차적 요청 - by 1-blue
  const {
    data: answersResponse,
    size,
    setSize,
    mutate,
  } = useSWRInfinite<IAnswerResponse>(
    router.query.id
      ? (pageIndex, previousPageData) => {
          if (previousPageData && !previousPageData.answers.length) return null;
          return `/api/${target}/${router.query.id}/answer?page=${pageIndex}&offset=${offset}`;
        }
      : () => null
  );

  // 2022/04/11 - 댓글 생성 관련 변수 및 메서드 - by 1-blue
  const [createAnswer, { loading: createAnswerLoading }] = useMutation(
    `/api/${target}/${router.query.id}/answer`
  );
  // 2022/03/27 - 댓글 추가 - by 1-blue
  const onSubmitAnswer = useCallback(
    (body: IAnswerForm) => {
      if (createAnswerLoading) return;

      mutate(
        (prev) =>
          prev && [
            ...prev,
            {
              ok: true,
              message: "mutate로 댓글 추가!",
              answers: [
                {
                  id: Date.now(),
                  answer: body.answer!,
                  updatedAt: Date.now(),
                  user: {
                    id: user?.id!,
                    name: user?.name!,
                    avatar: user?.avatar!,
                  },
                },
              ],
            },
          ],
        false
      );

      createAnswer(body);

      setToggle(true);
    },
    [createAnswerLoading, mutate, user, createAnswer, setToggle]
  );

  // 2022/04/19 - 댓글 제거 모달창 토글 - by 1-blue
  const [toggleModal, setToggleModal] = useState(false);
  // 2022/04/19 - 삭제할 댓글의 아이디를 담을 변수 - by 1-blue
  const [toRemoveAnswerId, setToRemoveAnswerId] = useState<null | number>(null);
  // 2022/04/19 - 댓글 제거 관련 변수 및 메서드 - by 1-blue
  const [
    removeAnswer,
    { loading: removeAnswerLoading, data: removeAnsweResponse },
  ] = useMutation<ApiResponse>(
    `/api/${target}/${router.query.id}/answer?answerId=${toRemoveAnswerId}`,
    "DELETE"
  );
  // 2022/04/19 - 댓글 제거 - by 1-blue
  const onRemoveAnswer = useCallback(() => {
    if (removeAnswerLoading) return toast.warning("이미 답변을 제거중입니다.");
    if (!toRemoveAnswerId) return toast.error("존재하지 않는 답변입니다.");

    mutate(
      (prev) =>
        prev &&
        prev.map((v) => ({
          ...v,
          answers: v.answers.filter((answer) => answer.id !== toRemoveAnswerId),
        })),
      false
    );

    removeAnswer({});
  }, [removeAnswerLoading, toRemoveAnswerId, removeAnswer, mutate]);
  // 2022/04/19 - 댓글 제거 성공 - by 1-blue
  useResponseToast({ response: removeAnsweResponse });

  return (
    <>
      {/* 댓글과 댓글 불러오기 버튼 */}
      {toggle && (
        <article>
          <section>
            <ul>
              {answersResponse?.map((answers) =>
                answers.answers.map((answer) => (
                  <Answer
                    key={answer.id}
                    answer={answer}
                    setToggleModal={setToggleModal}
                    setToRemoveAnswerId={setToRemoveAnswerId}
                  />
                ))
              )}
            </ul>
          </section>
          <section>
            {Math.ceil(count / offset) > size ? (
              <Button
                onClick={() => setSize((prev) => prev + 1)}
                text={`댓글 ${count - offset * size}개 더 불러오기`}
                $primary
                className="block mx-auto px-4"
                $loading={typeof answersResponse?.[size - 1] === "undefined"}
              />
            ) : (
              <span className="block text-center text-sm font-semibold my-2">
                더 이상 불러올 댓글이 존재하지 않습니다.
              </span>
            )}
          </section>
        </article>
      )}

      {/* 댓글 제출 폼 */}
      <AnswerForm onSubmit={onSubmitAnswer} isLoading={createAnswerLoading} />

      {toggleModal && (
        <Modal position="bottom" setToggleModal={setToggleModal}>
          <>
            <li>
              <button
                type="button"
                className="w-full p-4 text-lg"
                onClick={onRemoveAnswer}
              >
                댓글 제거
              </button>
            </li>
          </>
        </Modal>
      )}
    </>
  );
};

export default AnswerSection;
