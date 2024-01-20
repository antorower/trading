"use client";
import React, { useState } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import CopyWallet from "@/components/CopyWallet";

const RequestedRow = ({ account }) => {
  return (
    <TableRow>
      <div className="flex gap-4 items-center justify-center">
        <div className="relative w-[40px] h-[40px] flex justify-center items-center">
          <Image src="/avatar.svg" alt="user-image" fill="true" sizes="32x32" className="rounded-full" />
        </div>
        <div className="flex flex-col">
          <div className="">
            {account.user.firstName} {account.user.lastName}
          </div>
          <div className="text-gray-500 text-sm">{account.user.username}</div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="relative w-[40px] h-[40px] flex justify-center items-center">
          <Image src={`/${account.image}.svg`} alt="user-image" fill="true" sizes="32x32" className="rounded-full" />
        </div>
        <div>{account.company}</div>
      </div>
      <div className="text-gray-500">{new Date(account.createdDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
    </TableRow>
  );
};

export default RequestedRow;
