"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";

const TopBar = () => {
  const { user } = useUser();

  const { expandedSidebar, ToggleMenu, activeMenu } = useInterfaceContext();
  return (
    <div className="flex justify-between bg-light h-[60px] border-l-[1px] border-gray-700 px-8 relative">
      <div
        onClick={ToggleMenu}
        className="cursor-pointer absolute flex justify-center items-center text-white bg-light top-[15px] -left-[15px] rounded-full border border-gray-700 w-[30px] h-[30px]"
      >
        <Image src={`/${expandedSidebar ? "left" : "right"}-arrow.svg`} width={10} height={10} alt="left-arrow" />
      </div>
      <div className="flex items-center text-gray-400 pt-1">
        {activeMenu ? (
          <div>
            <Link href="/dashboard">Dashboard</Link> / <Link href={`/${activeMenu.toLowerCase()}`}>{activeMenu}</Link>
          </div>
        ) : (
          <Link href="/dashboard">Dashboard</Link>
        )}
      </div>
      <div className="text-gray-400 font-teko flex items-center text-3xl">$1400</div>
      <div className="flex items-center gap-8">
        <div className="relative w-[22px] h-[22px] cursor-pointer">
          <Image src="/messenger.svg" fill="true" />
        </div>
        <div className="relative w-[24px] h-[24px] cursor-pointer">
          <Image src="/notifications.svg" fill="true" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
