import { ReactChild, Suspense } from "react";
// import dynamic from "next/dynamic";

// util
import { combineClassNames } from "@src/libs/client/util";

// common-component
import Spinner from "@src/components/common/Spinner";

// danamic import + lazy loading
// const Spinner = dynamic(() => import("@src/components/common/Spinner"), {
//   ssr: false,
//   suspense: true,
// });

interface IProps {
  text: string | ReactChild;
  className?: string;
  $primary?: boolean;
  $loading?: boolean;
  [props: string]: any;
}

const Button = ({ text, className, $primary, $loading, ...props }: IProps) => {
  return (
    <button
      {...props}
      className={combineClassNames(
        $primary
          ? "py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          : "",
        className ? className : ""
      )}
    >
      {$loading ? (
        <Suspense fallback={<span>Loading...</span>}>
          <Spinner kinds="button" />
        </Suspense>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
