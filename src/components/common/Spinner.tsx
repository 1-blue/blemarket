import React, { useCallback } from "react";

type sinnerType = "button";

type Props = {
  kinds: sinnerType;
};

const Spinner = ({ kinds }: Props) => {
  const getSpinner = useCallback((kinds: sinnerType) => {
    switch (kinds) {
      case "button":
        return (
          <div className="w-6 h-6 mx-auto text-xs border-[5px] border-solid border-blue-400 border-t-blue-700 rounded-full animate-spin bg-transparent" />
        );

      default:
        return (
          <div className="w-6 h-6 mx-auto text-xs border-[5px] border-solid border-blue-400 border-t-blue-700 rounded-full animate-spin bg-transparent" />
        );
    }
  }, []);

  return <>{getSpinner(kinds)}</>;
};

export default Spinner;
