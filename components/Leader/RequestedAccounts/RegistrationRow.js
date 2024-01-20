"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const RegistrationRow = ({ account }) => {
  console.log("RegistrationRow Leader: ", account);
  return (
    <TableRow>
      <div className="flex gap-4 items-center justify-center">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </div>
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
      <div className="flex items-center justify-center gap-16">
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Company</div>
          <div>{account.company}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Capital</div>
          <div>${account.capital}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Date</div>
          <div>{new Date(account.moneyTransferDetails.transferDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Amount</div>
          <div>${account.moneyTransferDetails.transferAmount}</div>
        </div>
      </div>
      <div className="w-[400px] text-center">{account.comment}</div>
      <div className="relative w-[22px] h-[22px] animate-spin">
        <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
      </div>
    </TableRow>
  );
};

export default RegistrationRow;
