import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="bg-indigo-500 px-4 py-3 rounded-lg flex gap-4 items-center justify-center relative">
        <div className="relative w-[22px] h-[22px] animate-spin">
          <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
        </div>
        <div className="text-white font-roboto font-weight-600">Please wait...</div>
      </div>
    </div>
  );
};

export default Loading;
