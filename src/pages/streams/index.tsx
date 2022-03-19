import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

// component
import SideButton from "@src/components/SideButton";

const Live: NextPage = () => {
  return (
    <>
      <div className="divide-y-2">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <Link key={i} href={`/streams/${i}`}>
            <a className="flex flex-col space-y-2 p-4">
              <div className="w-full aspect-video bg-slate-300 rounded-md" />
              <h3 className="text-gray-700 font-semibold text-sm">
                video title
              </h3>
            </a>
          </Link>
        ))}
      </div>

      <Link href="/streams/create">
        <a>
          <SideButton>
            <Icon shape={ICON_SHAPE.CAMERA} />
          </SideButton>
        </a>
      </Link>
    </>
  );
};

export default Live;
