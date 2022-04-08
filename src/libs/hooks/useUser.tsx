import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

// type
import { User } from "@prisma/client";

export interface IUserResponse {
  ok: boolean;
  message: string;
  user?: User;
  error?: any;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useUser = () => {
  const router = useRouter();
  const { data, error, mutate } = useSWR<IUserResponse>(
    "/api/users/me",
    fetcher
  );

  useEffect(() => {
    if (data && !data.ok) {
      toast.error("로그인 후에 접근해주세요!");
    }
    if (data && !data.ok && router.pathname !== "/enter") {
      router.replace("/enter");
    }
  }, [router, data]);

  return { user: data?.user, loading: !data && !error, mutate };
};

export default useUser;
