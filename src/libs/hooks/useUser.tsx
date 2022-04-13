import { useRouter } from "next/router";
import { useEffect } from "react";
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
  const { data, error, mutate } = useSWR<IUserResponse>(
    "/api/users/me",
    fetcher
  );

  return { user: data?.user, loading: !data && !error, userMutate: mutate };
};

export default useUser;
