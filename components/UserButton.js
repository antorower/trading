"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAdminContext } from "@/context/AdminContext";

const UserButton = (props) => {
  const { id, imageUrl, username, firstName, lastName, isExpanded } = props;
  const { selectedUser, setSelectedUser } = useAdminContext();

  return (
    <button className="flex flex-col w-[150px] rounded text-gray-400 relative shadow-md shadow-black border-t-[1px] border-gray-700">
      <div className="flex w-full h-8 bg-violet-400 rounded-t"></div>
      <div className="w-full flex justify-center absolute top-[16px]">
        <div onClick={() => setSelectedUser(id)} className={`relative w-8 h-8 ${selectedUser === id && "my-4"}`}>
          <Image src={imageUrl} className={`rounded-full `} fill="true" sizes="32x32" alt="user" />
        </div>
      </div>
      <div className="flex w-full h-12 justify-center items-center rounded-b bg-dark pt-3 text-sm">{username}</div>
    </button>
  );
};

export default UserButton;
