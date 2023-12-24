"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useUserContext } from "@/context/UserContext";
import { usePathname } from "next/navigation";

const TopBar = () => {
  const { expandedLeftSidebar, setExpandedLeftSidebar, setActiveMenu } = useUserContext();
  const pathname = usePathname();

  return (
    <div className="flex items-center bg-light border-l-[1px] border-gray-700 px-8 relative p-4">
      <div onClick={() => setExpandedLeftSidebar(!expandedLeftSidebar)} className="cursor-pointer absolute flex justify-center items-center text-white bg-light top-[15px] -left-[15px] rounded-full border border-gray-700 w-[30px] h-[30px]">
        <Image src={`/${expandedLeftSidebar ? "left" : "right"}-arrow.svg`} width={10} height={10} alt="left-arrow" />
      </div>
      <div className="flex items-center text-gray-400 pt-1">
        {pathname != "/dashboard" && (
          <Link onClick={() => setActiveMenu("Dashboard")} href="/dashboard">
            Dashboard
          </Link>
        )}
      </div>
      <div className="text-gray-400 font-teko flex items-center text-3xl flex-grow justify-center">$1400</div>
    </div>
  );
};

export default TopBar;
