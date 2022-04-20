import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// hook
import useMe from "@src/libs/hooks/useMe";

type Props = {
  userId: number;
  message: string;
  move: string;
};

const usePermission = ({ userId, message, move }: Props) => {
  const router = useRouter();
  const { me } = useMe();

  useEffect(() => {
    if (me && me.id === userId) return;

    toast.warning(message);
    router.replace(move);
  }, [me, userId, message, router, move]);
};

export default usePermission;
