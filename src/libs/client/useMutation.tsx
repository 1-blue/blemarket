import { useState } from "react";

interface IState {
  loading: boolean;
  data: any;
  error: any;
}

// 2022/03/21 - API함수 및 유용한 변수들을 반환하는 hook - by 1-blue
export default function useMutation<T>(
  url: string
): [(body: T) => void, { loading: boolean; data: any; error: any }] {
  const [state, setState] = useState<IState>({
    loading: false,
    data: null,
    error: null,
  });

  const mutation = (body: T) => {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
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
