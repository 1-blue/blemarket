import { combineClassNames } from "@src/libs/client/util";

interface IProps {
  text: string;
  className?: string;
  [props: string]: any;
}

const Button = ({ text, className, ...props }: IProps) => {
  return (
    <button
      {...props}
      className={combineClassNames(
        "py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2",
        className ? className : ""
      )}
    >
      {text}
    </button>
  );
};

export default Button;
