import { combineClassNames } from "@src/libs/client/util";
import { ReactChild } from "react";

// common-component
import Spinner from "./Spinner";

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
      {$loading ? <Spinner kinds="button" /> : text}
    </button>
  );
};

export default Button;
