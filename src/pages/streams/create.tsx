import React from "react";
import type { NextPage } from "next";

const Create: NextPage = () => {
  return (
    <div className="px-4 space-y-4">
      <div>
        <label
          htmlFor="price-input"
          className="font-medium text-sm cursor-pointer"
        >
          Price
        </label>
        <div className="relative flex items-center mb-4">
          <span className="absolute left-2 text-sm select-none">$</span>
          <input
            id="price-input"
            type="text"
            placeholder="0.00"
            className="appearance-none w-full border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-500 focus:ring-0 pl-6 pr-12 text-sm"
          />
          <span className="absolute right-2 text-gray-500 font-medium select-none">
            USD
          </span>
        </div>
      </div>
      <div>
        <label
          htmlFor="desc-input"
          className="font-medium text-sm cursor-pointer"
        >
          Description
        </label>
        <div className="mb-4">
          <textarea
            id="desc-input"
            rows={6}
            className="appearance-none w-full border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-500 focus:ring-0 text-sm resize-none"
          />
        </div>
      </div>
      <button
        type="button"
        className="w-full bg-orange-500 py-2 text-white rounded-md hover:bg-orange-600 outline-none shadow-sm text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Go Live
      </button>
    </div>
  );
};

export default Create;
