"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const UpgradeRow = ({ account }) => {
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
      <div className="flex items-center justify-center flex-grow gap-16">
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Account Number</div>
          <div>{account.number}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Company</div>
          <div>{account.company}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Phase</div>
          {account.phase === 1 && "Evaluation"}
          {account.phase === 2 && "Verification"}
          {account.phase === 3 && "Funded"}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Balance</div>
          <div>${account.balance}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Trading Days Left</div>
          <div>{account.minimumTrades - account.tradesExecuted > 0 ? account.minimumTrades - account.tradesExecuted : 0}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Upgrade Date</div>
          {account.phase === 1 && <div>{new Date(account.moneyTransferDetails.transferDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>}
          {(account.phase === 2 || account.phase === 3) && <div>{new Date(account.createdDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>}
        </div>
      </div>
    </TableRow>
  );
};

export default UpgradeRow;
