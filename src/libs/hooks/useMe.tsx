import useSWR from "swr";

// type
import { User } from "@prisma/client";

export interface IMeResponse {
  ok: boolean;
  message: string;
  user?: User;
  error?: any;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useMe = () => {
  const { data, error, mutate } = useSWR<IMeResponse>("/api/users/me", fetcher);

  return { me: data?.user, meLoading: !data && !error, meMutate: mutate };
};

export default useMe;
