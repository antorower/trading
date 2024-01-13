"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const LiveRow = ({ account }) => {
  return (
    <TableRow>
      <div className="flex gap-4 items-center justify-center">
        <div className="relative w-[40px] h-[40px] flex justify-center items-center">
          <Image src={account.user.imageUrl} alt="user-image" fill="true" sizes="32x32" className="rounded-full" />
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
          <div className="text-gray-500 text-sm">Last Trade</div>
          {account.lastTradeOpenDate ? <div>{new Date(account.lastTradeOpenDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div> : "-"}
        </div>
      </div>
      <div className="flex items-center justify-center">
        {!account.openTrade.pending && (
          <div className="flex flex-col justify-center items-center">
            {new Date(account.lastTradeOpenDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) === new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) && (
              <div className="relative w-4 h-4 right-0">
                <Image src="/tick.svg" fill="true" alt="tick" sizes="32x32" />
              </div>
            )}
            {new Date(account.lastTradeOpenDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) != new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) && (
              <div className="relative w-4 h-4 right-0">
                <Image src="/reject-red.svg" fill="true" alt="tick" sizes="32x32" />
              </div>
            )}
            <div className="text-gray-500 text-sm">Trade Execution Today</div>
          </div>
        )}

        {account.openTrade.pending && (
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </div>
            <div>Close Trade</div>
          </div>
        )}
      </div>
    </TableRow>
  );
};

export default LiveRow;
