"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useInterfaceContext } from "@/context/InterfaceContext";
import MenuItem from "./MenuItem";

const SideBar = () => {
  const router = useRouter();
  const { user } = useUser();
  const { expandedSidebar, setExpandedSidebar } = useInterfaceContext();
  return (
    <div
      onMouseEnter={() => setExpandedSidebar(true)}
      onMouseLeave={() => setExpandedSidebar(false)}
      className={`bg-light font-nova font-weight-500 ${expandedSidebar && "px-6"} overflow-hidden transition-all duration-500 ease-in-out ${
        expandedSidebar ? "w-60" : "w-20"
      } flex flex-col gap-8`}
    >
      <div className="flex flex-col gap-8">
        <div
          className={`${expandedSidebar ? "p-4" : "py-4"} text-gray-400 flex flex-col justify-center gap-2 h-48 border-b-[1px] ${
            expandedSidebar ? "border-[#7a7979]" : "border-[#1F2128]"
          } transition-all duration-500`}
        >
          <div className="flex justify-center">
            <UserButton />
          </div>
          <div className={`transition-all duration-500 ${expandedSidebar ? "text-gray-400" : "text-[#1F2128]"} flex justify-center`}>
            {user && user.id && user.username}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {user?.publicMetadata.role === "admin" && <MenuItem menu="Admin" icon="admin" destination="/dashboard/admin" />}
          {user?.publicMetadata.role === "leader" && <MenuItem menu="Team" icon="admin" destination="/dashboard/admin" />}
          <MenuItem menu="Accounts" icon="accounts" destination="/dashboard/admin" />
          <MenuItem menu="Wallet" icon="dollar" destination="/dashboard/admin" />
          <MenuItem menu="Calendar" icon="calendar" destination="/dashboard/admin" />
          <MenuItem menu="Settings" icon="settings" destination="/dashboard/admin" />
        </div>
      </div>

      <div className={`border-b-[1px] ${expandedSidebar ? "border-[#7a7979]" : "border-[#1F2128]"} transition-all duration-500`}></div>

      <div className="text-gray-400 text-sm font-weight-400 flex flex-col">
        <div className={`${expandedSidebar ? "pl-4" : "pl-24"} transition-all duration-500 p-1 mb-4 flex justify-start items-center gap-3 text-white`}>
          Support
        </div>
        <div className="flex flex-col gap-4">
          <div className={`${expandedSidebar ? "pl-4" : "pl-24"} hover:pl-8 transition-all duration-500 cursor-pointer hover:text-white`}>News</div>
          <div className={`${expandedSidebar ? "pl-4" : "pl-24"} hover:pl-8 transition-all duration-500 cursor-pointer hover:text-white`}>Rules</div>
          <div className={`${expandedSidebar ? "pl-4" : "pl-24"} hover:pl-8 transition-all duration-500 cursor-pointer hover:text-white`}>Guides</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
