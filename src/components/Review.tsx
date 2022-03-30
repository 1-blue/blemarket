// type
import { ICON_SHAPE, SimpleUser } from "@src/types";
import { Review } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";

// util
import { combineClassNames } from "@src/libs/client/util";

interface IReviewWithWriter extends Review {
  createdBy: SimpleUser;
}

interface IProps {
  review: IReviewWithWriter;
}

const Review = ({ review }: IProps) => {
  return (
    <div>
      <div className="flex pt-4 mb-4">
        <div className="w-12 h-12 bg-slate-400 rounded-full mr-2" />
        <div className="flex-1">
          <h4>{review.createdBy.name}</h4>
          <div className="flex">
            {Array(5)
              .fill(null)
              .map((_, i) => i + 1)
              .map((v) => (
                <Icon
                  key={v}
                  shape={ICON_SHAPE.STAR}
                  $fill
                  className={combineClassNames(
                    "w-5 h-5",
                    v > review.score ? "text-gray-400" : "text-yellow-400"
                  )}
                />
              ))}
          </div>
        </div>
        <div>{review.createdAt}</div>
      </div>
      <p className="text-sm px-4 py-2 rounded-md bg-gray-200 whitespace-pre">
        {review.review}
      </p>
    </div>
  );
};

export default Review;
