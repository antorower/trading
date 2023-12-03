import React from "react";
import Image from "next/image";

const Name = () => {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center p-4 gap-4">
      <div className="w-[200px] h-[200px] relative">
        <Image src="/not-allowed.svg" fill="true" sizes="32x32" />
      </div>
      <div className="text-white text-xl font-nova"> You have no permissions to do that! </div>
    </div>
  );
};

export default Name;
