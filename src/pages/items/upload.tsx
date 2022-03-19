import type { NextPage } from "next";

const Upload: NextPage = () => {
  return (
    <div className="px-4">
      <div className="mb-4">
        <label className="flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-400 text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer rounded-md">
          <svg
            className="h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input type="file" hidden />
        </label>
      </div>
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
        Upload product
      </button>
    </div>
  );
};

export default Upload;
