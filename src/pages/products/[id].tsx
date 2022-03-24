import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";

const ItemDatail: NextPage = () => {
  return (
    <>
      <div className="px-4">
        <div className="h-96 w-full bg-slate-300" />
        <Link href="/profile">
          <a className="flex items-center border-y py-4 space-x-2 cursor-pointer mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-300" />
            <div>
              <p className="font-semibold">Steve Jebs</p>
              <span className="text-xs font-semibold text-gray-500">
                View profile &rarr;
              </span>
            </div>
          </a>
        </Link>
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl mb-1">Galaxy S50</h1>
          <p className="font-semibold text-2xl mb-4">$140</p>
          <p className="text-gray-900 mb-4">
            My money&apos;s in that office, right? If she start giving me some
            bullshit about it ain&apos;t there, and we got to go someplace else
            and get it, I&apos;m gonna shoot you in the head then and there.
            Then I&apos;m gonna shoot that bitch in the kneecaps, find out where
            my goddamn money is. She gonna tell me too. Hey, look at me when
            I&apos;m talking to you, motherfucker. You listen: we go in there,
            and that ni**a Winston or anybody else is in there, you the first
            motherfucker to get shot. You understand?
          </p>
          <div className="flex justify-between space-x-2  ">
            <Button text="Talk to seller" type="button" className="flex-1" />
            <button className="p-3 bg-red-100 rounded-md hover:bg-red-200 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">
              <Icon shape={ICON_SHAPE.HEART} />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <h2 className="font-bold text-2xl mb-6">Similar items</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <Link key={i} href={`/`}>
              <a>
                <div className="h-56 w-full bg-slate-300 mb-2" />
                <h3 className="text-gray-700">Galaxy S60</h3>
                <p className="text-gray-900 font-semibold">$6</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemDatail;
