import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

const Activation = async () => {
  const user = await currentUser();
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <Image src="/tick.svg" width={70} height={70} alt="tick" />
      <div className="font-nova text-2xl text-white w-[450px] text-center flex justify-center">
        {`We appreciate your presence ${user.username} and eagerly anticipate activating your account as soon as possible.`}
      </div>
    </div>
  );
};

export default Activation;
