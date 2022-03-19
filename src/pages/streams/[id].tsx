import React from "react";
import type { NextPage } from "next";

const StreamDetail: NextPage = () => {
  return (
    <>
      <div className="px-4">
        <div className="w-full aspect-video bg-slate-300 rounded-md mb-2" />
        <h3 className="text-gray-700 font-semibold text-2xl">video title</h3>
      </div>

      <div className="px-4 mb-24 space-y-4 h-[50vh] overflow-y-auto">
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">
            Hi how much are you selling them for?
          </div>
        </div>
        <div className="flex space-x-2 flex-row-reverse space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">I want ￦20,000</div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">미쳤어</div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">
            Hi how much are you selling them for?
          </div>
        </div>
        <div className="flex space-x-2 flex-row-reverse space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">I want ￦20,000</div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">미쳤어</div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">
            Hi how much are you selling them for?
          </div>
        </div>
        <div className="flex space-x-2 flex-row-reverse space-x-reverse">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">I want ￦20,000</div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-400" />
          <div className="w-1/2 border-2 rounded-md p-2">미쳤어</div>
        </div>

        <div className="fixed bottom-24 max-w-lg w-10/12 inset-x-0 mx-auto flex justify-center items-center">
          <input
            type="text"
            className="w-full rounded-full focus:outline-none focus:border-orange-500 focus:ring-0 pr-14"
          />
          <button
            type="button"
            className="absolute right-2 translate-y--1/2 bg-orange-400 px-3 py-1 rounded-full text-white font-bold focus:outline-none focus:ring-orange-500 focus:ring-1 focus:ring-offset-2"
          >
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StreamDetail;
