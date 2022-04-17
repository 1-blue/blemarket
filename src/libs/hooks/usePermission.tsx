import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// hook
import useUser from "@src/libs/hooks/useUser";

type Props = {
  userId: number;
  message: string;
  move: string;
};

const usePermission = ({ userId, message, move }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id === userId) return;

    toast.warning(message);
    router.replace(move);
  }, [user, userId, message, router, move]);
};

export default usePermission;
