import { Dispatch, SetStateAction, useCallback } from "react";

// util
import { combineClassNames } from "@src/libs/client/util";

interface IProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  max: number;
}

const PageButton = ({
  page,
  $point,
  onClick,
  max,
}: {
  page: string | number;
  $point?: boolean;
  onClick: () => void;
  max?: number;
}) => {
  return (
    <li
      className={combineClassNames(
        "flex-1 text-center",
        max && max < page ? "hidden" : ""
      )}
    >
      <button
        type="button"
        className={combineClassNames(
          "w-full h-full  py-2 text-sm font-semibold rounded-md hover:bg-orange-400 hover:text-white",
          $point ? "bg-orange-400 text-white" : ""
        )}
        onClick={onClick}
      >
        {page}
      </button>
    </li>
  );
};

const Pagination = ({ page, setPage, max }: IProps) => {
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
            key={i + page - 2}
            page={i + page - 2}
            $point={i + page - 2 === page}
            onClick={onClick(i + page - 2)}
            max={max}
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
            max={max}
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
            max={max}
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
            $point={i + 1 === max}
            onClick={onClick(max - (5 - i - 1))}
            max={max}
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
            $point={i + 1 === max - 1}
            onClick={onClick(max - (5 - i - 1))}
            max={max}
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
          max={max}
        />
      ));
  }, [page, max, onClick]);

  return (
    <ul className="w-2/3 mx-auto flex justify-between space-x-1">
      <PageButton page="<" onClick={onClickPrevious} />
      {getPageButton()}
      <PageButton page=">" onClick={onClickNext} />
    </ul>
  );
};

export default Pagination;
