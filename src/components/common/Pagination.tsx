import { Dispatch, SetStateAction, useCallback, useState } from "react";

// util
import { combineClassNames } from "@src/libs/client/util";
import useSWR from "swr";

interface IProps {
  url: string;
  page: number;
  offset: number;
  setPage: Dispatch<SetStateAction<number>>;
  max: number;
}

const PageButton = ({
  page,
  $point,
  $hidden,
  $disabled,
  onClick,
  onHover,
}: {
  page: string | number;
  $point?: boolean;
  $hidden?: boolean;
  $disabled?: boolean;
  onClick: () => void;
  onHover?: () => void;
}) => {
  return (
    <li
      className={combineClassNames("text-center w-11", $hidden ? "hidden" : "")}
    >
      <button
        type="button"
        className={combineClassNames(
          "w-full h-full py-2 text-sm font-semibold rounded-md hover:bg-orange-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          $point ? "bg-orange-400 text-white" : "",
          $disabled ? "text-gray-400" : ""
        )}
        onClick={$disabled ? () => {} : onClick}
        onMouseEnter={onHover}
      >
        {page}
      </button>
    </li>
  );
};

const Pagination = ({ url, page, offset, setPage, max }: IProps) => {
  // 2022/04/05 - 페이지 링크위에 마우스 올리면 패치 시작 - by 1-blue
  const [preFetchPageNumber, setPreFetchPageNumber] = useState<null | number>(
    null
  );
  // 2022/04/05 - 미래 패치할 페이지 번호 지정 - by 1-blue
  const onPreFetch = useCallback(
    (pageNumber) => () => setPreFetchPageNumber(pageNumber),
    [setPreFetchPageNumber]
  );
  useSWR(
    url === null || preFetchPageNumber === null
      ? null
      : url.includes("?")
      ? `${url}&page=${preFetchPageNumber}&offset=${offset}`
      : `${url}?page=${preFetchPageNumber}&offset=${offset}`
  );

  // 2022/04/02 - 페이지 버튼 클릭 - by 1-blue
  const onClick = useCallback(
    (pageNumber) => () => setPage(pageNumber),
    [setPage]
  );
  // 2022/04/02 - 이전 페이지 버튼 클릭 - by 1-blue
  const onClickPrevious = useCallback(
    () => setPage((prev) => prev - 1),
    [setPage]
  );
  // 2022/04/02 - 다음 페이지 버튼 클릭 - by 1-blue
  const onClickNext = useCallback(() => setPage((prev) => prev + 1), [setPage]);

  // 각 조건마다 if문으로 나누지 않고 수식을 적용해서 해결하려했지만 방법을 모르겠음
  // 2022/04/02 - 각 경우에 따른 페이지 버튼 랜더링 - by 1-blue
  const getPageButton = useCallback(() => {
    // 5개의 페이지가 안나오는 경우
    if (max < 5) {
      return Array(max)
        .fill(page)
        .map((v, i) => (
          <PageButton
            key={i + 1}
            page={i + 1}
            $point={i + 1 === page}
            onClick={onClick(i + 1)}
            $hidden={i + 1 > max || max < page}
            onHover={onPreFetch(i + 1)}
          />
        ));
    }

    // 첫번째 페이지
    if (1 === page) {
      return Array(5)
        .fill(page)
        .map((v, i) => (
          <PageButton
            key={i + 1}
            page={i + 1}
            $point={1 === i + 1}
            onClick={onClick(i + 1)}
            $hidden={max < page}
            onHover={onPreFetch(i + 1)}
          />
        ));
    }
    // 두번째 페이지
    if (2 === page) {
      return Array(5)
        .fill(page)
        .map((v, i) => (
          <PageButton
            key={i + 1}
            page={i + 1}
            $point={2 === i + 1}
            onClick={onClick(i + 1)}
            $hidden={max < page}
            onHover={onPreFetch(i + 1)}
          />
        ));
    }

    // 마지막 페이지인 경우
    if (max === page) {
      return Array(5)
        .fill(page)
        .map((v, i) => (
          <PageButton
            key={max - (5 - i - 1)}
            page={max - (5 - i - 1)}
            $point={i === 4}
            onClick={onClick(max - (5 - i - 1))}
            $hidden={max < page}
            onHover={onPreFetch(max - (5 - i - 1))}
          />
        ));
    }
    // 마지막 전페이지인 경우
    if (max - 1 === page) {
      return Array(5)
        .fill(page)
        .map((v, i) => (
          <PageButton
            key={max - (5 - i - 1)}
            page={max - (5 - i - 1)}
            $point={i === 3}
            onClick={onClick(max - (5 - i - 1))}
            $hidden={max < page}
            onHover={onPreFetch(max - (5 - i - 1))}
          />
        ));
    }

    // 이외에 정상적으로 나오는 경우
    return Array(5)
      .fill(page)
      .map((v, i) => (
        <PageButton
          key={i + page - 2}
          page={i + page - 2}
          $point={i + page - 2 === page}
          onClick={onClick(i + page - 2)}
          $hidden={max < page}
          onHover={onPreFetch(i + page - 2)}
        />
      ));
  }, [page, max, onClick, onPreFetch]);

  return (
    <article>
      <ul className="mx-auto flex justify-center space-x-2 mt-6 mb-4">
        <PageButton
          page="⮜"
          onClick={onClickPrevious}
          $disabled={1 > page - 1}
        />
        {getPageButton()}
        <PageButton page="⮞" onClick={onClickNext} $disabled={max < page + 1} />
      </ul>
    </article>
  );
};

export default Pagination;
