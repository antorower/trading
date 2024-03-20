"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import MenuItem from "./MenuItem";
import { useUserContext } from "@/context/UserContext";

const SideBar = () => {
  const { user } = useUser();
  const { expandedLeftSidebar, setExpandedLeftSidebar } = useUserContext();

  return (
    <div onMouseEnter={() => setExpandedLeftSidebar(true)} onMouseLeave={() => setExpandedLeftSidebar(false)} className={`bg-light font-nova font-weight-500 ${expandedLeftSidebar && "px-6"} overflow-x-hidden overflow-y-auto transition-all duration-500 ease-in-out ${expandedLeftSidebar ? "w-60" : "w-20"} flex flex-col gap-8 h-full scrollable`}>
      <div className="flex flex-col gap-8">
        <div className={`${expandedLeftSidebar ? "p-4" : "py-4"} text-gray-400 flex flex-col justify-center gap-2 h-48 border-b-[1px] ${expandedLeftSidebar ? "border-[#7a7979]" : "border-[#1F2128]"} transition-all duration-500`}>
          <div className="flex justify-center">
            <UserButton />
          </div>
          <div className={`transition-all duration-500 ${expandedLeftSidebar ? "text-gray-400" : "text-[#1F2128]"} flex justify-center`}>{user && user.id && user.username}</div>
        </div>
        <div className="flex flex-col gap-4">
          {user?.publicMetadata.role === "admin" && <MenuItem menu="Admin" icon="admin" destination="/dashboard/admin" />}
          {(user?.publicMetadata.role === "leader" || user?.publicMetadata.role === "admin") && <MenuItem menu="Team" icon="admin" destination="/dashboard/leader" />}
          <MenuItem menu="Accounts" icon="accounts" destination="/dashboard/accounts" />
          <MenuItem menu="Calendar" icon="calendar" destination="/dashboard/calendar" />
          <MenuItem menu="Settings" icon="settings" destination="/dashboard/settings" />
        </div>
      </div>

      <div className={`border-b-[1px] ${expandedLeftSidebar ? "border-[#7a7979]" : "border-[#1F2128]"} transition-all duration-500`}></div>

      {false && (
        <div className="text-gray-400 text-sm font-weight-400 flex flex-col pb-12">
          <div className={`${expandedLeftSidebar ? "pl-4" : "pl-24"} transition-all duration-500 p-1 mb-4 flex justify-start items-center gap-3 text-white`}>Support</div>
          <div className="flex flex-col gap-4">
            <div className={`${expandedLeftSidebar ? "pl-4" : "pl-24"} hover:pl-8 transition-all duration-500 cursor-pointer hover:text-white`}>News</div>
            <div className={`${expandedLeftSidebar ? "pl-4" : "pl-24"} hover:pl-8 transition-all duration-500 cursor-pointer hover:text-white`}>Rules</div>
            <div className={`${expandedLeftSidebar ? "pl-4" : "pl-24"} hover:pl-8 transition-all duration-500 cursor-pointer hover:text-white`}>Guides</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
