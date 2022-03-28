import { useRouter } from "next/router";
import { useEffect } from "react";
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

const useUser = () => {
  const router = useRouter();
  const { data, error } = useSWR<IUserResponse>("/api/users/me");

  useEffect(() => {
    if (data && !data?.ok) router.replace("/enter");
  }, [router, data]);

  return { user: data?.user, loading: !data && !error };
};

export default useUser;
