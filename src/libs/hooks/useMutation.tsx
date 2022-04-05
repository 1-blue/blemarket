import { useState } from "react";

import {
  IEnterForm,
  ITokenForm,
  IUploadForm,
  IQuestionForm,
  IAnswerForm,
  IUpdateForm,
  IStramForm,
  IMessageForm,
} from "@src/types";

interface IUseMutationState<T> {
  loading: boolean;
  data: T | null;
  error: any;
}
type UseMutationResult<T> = [
  (
    body:
      | IEnterForm
      | ITokenForm
      | IUploadForm
      | IQuestionForm
      | IAnswerForm
      | IUpdateForm
      | IStramForm
      | IMessageForm
      | null
  ) => void,
  IUseMutationState<T>
];

// 2022/03/21 - API함수 및 유용한 변수들을 반환하는 hook - by 1-blue
export default function useMutation<T>(
  url: string,
  method = "POST"
): UseMutationResult<T> {
  const [state, setState] = useState<IUseMutationState<T>>({
    loading: false,
    data: null,
    error: null,
  });

  const mutation = (
    body:
      | IEnterForm
      | ITokenForm
      | IUploadForm
      | IQuestionForm
      | IAnswerForm
      | IUpdateForm
      | IStramForm
      | IMessageForm
      | null
  ) => {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  };

  return [mutation, state];
}
