import type { NextPage } from "next";
import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";
import Button from "@src/components/common/Button";

const CommunityPostDetail: NextPage = () => {
  return (
    <>
      <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        동네질문
      </span>
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
      <div>
        <div className="mt-2 px-4 text-gray-700">
          <span className="text-orange-500 font-medium">Q.</span> What is the
          best mandu restaurant?
        </div>
        <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
          <span className="flex space-x-2 items-center text-sm">
            <Icon shape={ICON_SHAPE.CHECK} width={16} height={16} />
            <span>궁금해요 1</span>
          </span>
          <span className="flex space-x-2 items-center text-sm">
            <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
            <span>답변 1</span>
          </span>
        </div>
      </div>
      <div className="px-4 my-5 space-y-5">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
          <div>
            <span className="text-sm block font-medium text-gray-700">
              Steve Jebs
            </span>
            <span className="text-xs text-gray-500 block ">2시간 전</span>
            <p className="text-gray-700 mt-2">
              The best mandu restaurant is the one next to my house.
            </p>
          </div>
        </div>
      </div>
      <div className="px-4">
        <textarea
          className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 resize-none"
          rows={6}
          placeholder="Answer this question!"
        />
        <Button type="button" text="Reply" className="w-full mt-2" />
      </div>
    </>
  );
};

export default CommunityPostDetail;
