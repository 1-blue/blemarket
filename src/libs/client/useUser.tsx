import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

export interface IUserResponse {
  ok: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: any;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useUser = () => {
  const router = useRouter();
  const { data, error } = useSWR<IUserResponse>("/api/users/me", fetcher);

  useEffect(() => {
    // 로그인 하지 않은 상태에서 /enter외 다른 페이지 접근했을 경우 실행
    if (data && !data?.ok && router.pathname !== "/enter") {
      toast.error("🚨 로그인후에 접근해주세요 🚨");
      router.replace("/enter");
    }
  }, [router, data]);

  return { user: data?.user, loading: !data && !error };
};

export default useUser;
