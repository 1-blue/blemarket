import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";

interface IOption {
  initialPage?: number;
  initialOffset?: number;
}

export default function usePagination<T>(
  url: string | null,
  { initialPage = 1, initialOffset = 10 }: IOption
): [
  { data?: T; error: any },
  { page: number; setPage: Dispatch<SetStateAction<number>> },
  {
    offset: number;
    setOffset: Dispatch<SetStateAction<number>>;
  }
] {
  const [page, setPage] = useState(initialPage);
  const [offset, setOffset] = useState(initialOffset);
  const { data, error } = useSWR<T>(
    url === null
      ? null
      : url.includes("?")
      ? `${url}&page=${page}&offset=${offset}`
      : `${url}?page=${page}&offset=${offset}`
  );

  // 2022/04/05 - 현페이지의 앞/뒤 페이지 미리 패치하기 - by 1-blue
  useSWR(
    url === null
      ? null
      : url.includes("?")
      ? `${url}&page=${page + 1}&offset=${offset}`
      : `${url}?page=${page + 1}&offset=${offset}`
  );
  useSWR(
    url === null || page < 2
      ? null
      : url.includes("?")
      ? `${url}&page=${page - 1}&offset=${offset}`
      : `${url}?page=${page - 1}&offset=${offset}`
  );

  return [
    { data, error },
    { page, setPage },
    { offset, setOffset },
  ];
}
