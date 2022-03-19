import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

const Chats: NextPage = () => {
  return (
    <div className="divide-y-[1px]">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Link key={i} href={`/chats/${i}`}>
          <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Steve Jebs</p>
              <p className="text-xs text-gray-500">last message...</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Chats;
