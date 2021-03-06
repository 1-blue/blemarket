import { combineClassNames } from "@src/libs/client/util";

type Props = {
  text: string;
  $success?: boolean;
  $warning?: boolean;
  $error?: boolean;
};

const Notice = ({ text, $success, $warning, $error }: Props) => {
  return (
    <span
      className={combineClassNames(
        "text-sm text-center mt-2 font-semibold",
        $success ? "text-blue-500" : "",
        $warning ? "text-green-500" : "",
        $error ? "text-red-500" : ""
      )}
    >
      {$success && "○ "}
      {$warning && "△ "}
      {$error && "X "}
      {text}
    </span>
  );
};

export default Notice;
