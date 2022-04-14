import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

// type
import { ApiResponse } from "@src/types";

interface IResponse extends ApiResponse {
  [key: string]: any;
}

interface IProps {
  response: IResponse | null;
  successMessage?: string;
  errorMessage?: string;
  move?: string;
}

// 2022/04/05 - 결과값으로 인한 토스트 메시지 보여주는 훅 - 1-blue
const useResponseToast = ({
  response,
  successMessage,
  errorMessage,
  move,
}: IProps) => {
  const router = useRouter();

  useEffect(() => {
    if (response && !response.ok) {
      toast.error(errorMessage || response.message);
    } else if (response && response.ok) {
      toast.success(successMessage || response.message);
      // >>> 원인 모를 이유 때문에 "/"경로로 이동이 안돼서 "/#"으로 처리함
      if (move === "/") router.push("/#");
      else if (move) router.push(move);
    }
  }, [response, successMessage, errorMessage, move, router]);
};

export default useResponseToast;
