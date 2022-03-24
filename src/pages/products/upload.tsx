import type { NextPage } from "next";

// common-component
import Button from "@src/components/common/Button";
import Icon from "@src/components/common/Icon";
import { ICON_SHAPE } from "@src/types";

const Upload: NextPage = () => {
  return (
    <ul className="px-4 space-y-4">
      <li>
        <label
          id="image-input"
          className="flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-400 text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer rounded-md"
        >
          <Icon shape={ICON_SHAPE.PHOTO} width={48} height={48} />
          <input name="image-input" type="file" hidden />
        </label>
      </li>
      <li>
        <label
          htmlFor="name-input"
          className="font-medium text-sm cursor-pointer"
        >
          name
        </label>
        <input
          id="name-input"
          type="text"
          className="appearance-none w-full border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-500 focus:ring-0 px-4 text-sm"
        />
      </li>
      <li>
        <label
          htmlFor="price-input"
          className="font-medium text-sm cursor-pointer"
        >
          Price
        </label>
        <div className="relative flex items-center">
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
      </li>
      <li>
        <label
          htmlFor="desc-input"
          className="font-medium text-sm cursor-pointer"
        >
          Description
        </label>
        <textarea
          id="desc-input"
          rows={6}
          className="appearance-none w-full border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-500 focus:ring-0 text-sm resize-none"
        />
      </li>
      <li>
        <Button type="button" text="Upload product" className="w-full" />
      </li>
    </ul>
  );
};

export default Upload;
