"use client";
import React, { useState, useEffect } from "react";
import UserButton from "./UserButton";
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";

const UserBar = () => {
  const { teamUsers, UpdateAccounts } = useUserContext();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { expandedRightSidebar, setExpandedRightSidebar } = useUserContext();

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setSearchedUsers(teamUsers);
    } else {
      const filteredUsers = teamUsers.filter(
        (user) =>
          user.username &&
          user.firstName &&
          user.lastName && // Check if all properties exist
          (user.username.toLowerCase().includes(searchKeyword.toLowerCase()) || user.firstName.toLowerCase().includes(searchKeyword.toLowerCase()) || user.lastName.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setSearchedUsers(filteredUsers);
    }
    console.log("All ok to user bar");
  }, [searchKeyword, teamUsers]);

  return (
    <div onMouseEnter={() => setExpandedRightSidebar(true)} onMouseLeave={() => setExpandedRightSidebar(false)} className={`flex flex-col gap-4 h-full relative justify-center p-4 ${expandedRightSidebar ? "w-[320px]" : "w-[0px]"} transition-all duration-500 border-l border-gray-900`}>
      <div onClick={() => setExpandedRightSidebar(!expandedRightSidebar)} className="cursor-pointer absolute flex justify-center items-center text-white bg-dark  -left-[20px] rounded-full border border-gray-900 w-[40px] h-[40px]">
        <Image src={`/${expandedRightSidebar ? "left" : "right"}-arrow.svg`} width={10} height={10} alt="left-arrow" />
      </div>
      <div className="flex flex-col h-14 items-center justify-center gap-4 overflow-x-hidden relative">
        <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search user" className="text-input w-[200px] overflow-hidden flex justify-center" />
      </div>
      <div className="flex flex-col h-14 items-center justify-center gap-4 overflow-x-hidden relative">
        <button onClick={() => UpdateAccounts(null)} className="btn-primary w-52 text-white">
          Show all users
        </button>
      </div>
      <div className={`flex flex-col justify-start items-center h-full gap-4 overflow-y-auto overflow-x-hidden scrollable`}>
        {searchedUsers &&
          searchedUsers.length > 0 &&
          searchedUsers.map((user) => (
            <div key={user.id}>
              <UserButton user={user} isExpaned={expandedRightSidebar} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserBar;
