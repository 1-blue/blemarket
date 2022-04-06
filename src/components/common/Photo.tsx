import Image from "next/image";

// util
import { combineClassNames, combinePhotoUrl } from "@src/libs/client/util";

const Photo = ({
  photo,
  className,
  $cover,
  $contain,
}: {
  photo?: string | null;
  className?: string;
  $cover?: boolean;
  $contain?: boolean;
}) => {
  return (
    <>
      {photo ? (
        <figure
          className={combineClassNames(
            "relative bg-black rounded-md",
            className ? className : ""
          )}
        >
          <Image
            src={combinePhotoUrl(photo)}
            layout="fill"
            className={combineClassNames(
              "rounded-md",
              $cover ? "object-cover" : "",
              $contain ? "object-contain" : ""
            )}
            alt="이미지"
          />
        </figure>
      ) : (
        <figure
          className={combineClassNames(
            "rounded-md bg-slate-400",
            className ? className : ""
          )}
        />
      )}
    </>
  );
};

export default Photo;
