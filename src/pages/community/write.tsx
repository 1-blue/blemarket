import React from "react";
import type { NextPage } from "next";
import Button from "@src/components/common/Button";

const Write: NextPage = () => {
  return (
    <div className="px-4">
      <textarea
        className="mt-1 shadow-sm w-full focus:ring-orange-500 rounded-md border-gray-300 focus:border-orange-500 resize-none"
        rows={6}
        placeholder="Ask this question!"
      />
      <Button type="button" text="Submit" className="w-full mt-2" />
    </div>
  );
};

export default Write;
