import React from "react";

interface IProps {
  children: React.ReactNode;
}

const SideButton = ({ children }: IProps) => {
  return (
    <button className="fixed bottom-24 right-4 bg-orange-400 p-3 rounded-full text-white hover:bg-orange-500 cursor-pointer opacity-90 shadow-lg">
      {children}
    </button>
  );
};

export default SideButton;
