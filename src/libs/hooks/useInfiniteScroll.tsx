import { useCallback, useEffect } from "react";

type Props = {
  condition: boolean;
  setSize: (size: number | ((_size: number) => number)) => any;
};

const useInfiniteScroll = ({ condition, setSize }: Props) => {
  // 2022/04/13 - 인피니티 스크롤링 함수 - by 1-blue
  const infiniteScrollEvent = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >=
        document.documentElement.scrollHeight - 400 &&
      condition
    ) {
      setSize((prev) => prev + 1);
    }
  }, [condition, setSize]);

  // 2022/04/13 - 무한 스크롤링 이벤트 등록/해제 - by 1-blue
  useEffect(() => {
    window.addEventListener("scroll", infiniteScrollEvent);

    return () => window.removeEventListener("scroll", infiniteScrollEvent);
  }, [infiniteScrollEvent]);
};

export default useInfiniteScroll;
