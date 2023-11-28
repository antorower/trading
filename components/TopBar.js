"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";

const TopBar = () => {
  const { user } = useUser();
  const { expandedLeftSidebar, setExpandedLeftSidebar, setActiveMenu } = useInterfaceContext();

  return (
    <div className="flex justify-between items-center bg-light border-l-[1px] border-gray-700 px-8 relative p-4">
      <div
        onClick={() => setExpandedLeftSidebar(!expandedLeftSidebar)}
        className="cursor-pointer absolute flex justify-center items-center text-white bg-light top-[15px] -left-[15px] rounded-full border border-gray-700 w-[30px] h-[30px]"
      >
        <Image src={`/${expandedLeftSidebar ? "left" : "right"}-arrow.svg`} width={10} height={10} alt="left-arrow" />
      </div>
      <div className="flex items-center text-gray-400 pt-1">
        <Link onClick={() => setActiveMenu("Dashboard")} href="/dashboard">
          Dashboard
        </Link>
      </div>
      <div className="text-gray-400 font-teko flex items-center text-3xl">$1400</div>
      <div className="flex items-center gap-8">
        <div className="relative w-[22px] h-[22px] cursor-pointer">
          <Image src="/messenger.svg" fill="true" alt="icons" />
        </div>
        <div className="relative w-[24px] h-[24px] cursor-pointer">
          <Image src="/notifications.svg" fill="true" alt="icons" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
