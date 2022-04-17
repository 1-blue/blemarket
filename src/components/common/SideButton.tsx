import React from "react";
import Link from "next/link";

type Props = {
  url?: string;
  contents: React.ReactNode | string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const SideButton = ({ url, contents, onClick }: Props) => {
  return (
    <aside>
      {url ? (
        <Link href={url}>
          <a tabIndex={-1}>
            <button className="fixed bottom-24 right-4 bg-orange-400 p-3 rounded-full text-white hover:bg-orange-500 cursor-pointer opacity-90 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              {contents}
            </button>
          </a>
        </Link>
      ) : (
        <button
          className="fixed bottom-24 right-4 bg-orange-400 p-3 rounded-full text-white hover:bg-orange-500 cursor-pointer opacity-90 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          onClick={onClick}
        >
          {contents}
        </button>
      )}
    </aside>
  );
};

export default SideButton;
