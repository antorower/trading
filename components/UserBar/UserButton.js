"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";

const UserButton = (props) => {
  const { user } = props;
  // const { id, imageUrl, username, firstName, lastName } = props;
  //imageUrl={user.imageUrl} id={user.id} username={user.username} firstName={user.firstName} lastName={user.lastName}
  const { UpdateAccounts } = useUserContext();

  return (
    <button onClick={() => UpdateAccounts(user)} className="flex flex-col w-[200px] rounded text-gray-400 relative shadow-md shadow-black border-t-[1px] border-gray-700">
      <div className={`flex w-full h-8 rounded-t bg-violet-400`}></div>
      <div className="w-full flex justify-center absolute top-[16px]">
        <div className="relative w-8 h-8">
          <Image src="/avatar.svg" className={`rounded-full `} fill="true" sizes="32x32" alt="user" />
        </div>
      </div>
      <div className="flex w-full flex-col justify-center items-center rounded-b bg-dark pt-6 pb-4 px-2 text-sm">
        <div>
          {user.firstName} {user.lastName}
        </div>
        <div className="text-gray-500">{user.username}</div>
      </div>
    </button>
  );
};

export default UserButton;
