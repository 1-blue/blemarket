import { Dispatch, SetStateAction } from "react";

// util
import { combineClassNames } from "@src/libs/client/util";

type Props = {
  children: React.ReactChild;
  position: "middle" | "bottom";
  setToggleModal: Dispatch<SetStateAction<boolean>>;
};

const Modal = ({ children, position, setToggleModal }: Props) => {
  return (
    <aside
      className={combineClassNames(
        "fixed bg-black/60 top-0 left-0 w-full h-full z-20 flex justify-center animate-fade-in",
        position === "bottom" ? "items-end" : "",
        position === "middle" ? "items-center" : ""
      )}
      onClick={() => setToggleModal(false)}
    >
      <section
        className={combineClassNames(
          "flex flex-col bg-white max-w-[512px] w-full divide-y-2 overflow-hidden",
          position === "bottom" ? "animate-bottom-up" : "",
          position === "middle"
            ? "max-w-[480px] rounded-md animate-fade-in"
            : ""
        )}
      >
        <ul className="divide-y-2">{children}</ul>
      </section>
    </aside>
  );
};

export default Modal;
