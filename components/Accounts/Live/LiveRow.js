"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const LiveRow = ({ account }) => {
  return (
    <TableRow>
      <div className="flex gap-8 items-center">
        {new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ||
          (new Date(account.lastTradeCloseDate).toDateString() != new Date().toDateString() && (
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-400 opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-500`}></span>
            </div>
          ))}
        <div className="flex items-center gap-2">
          <div className="text-gray-500 text-sm">Account Number:</div>
          <div>{account.number}</div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-grow gap-16">
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
      </div>
      {new Date(account.lastTradeOpenDate).toDateString() === new Date().toDateString() && new Date(account.dates.lastTradeCloseDate).toDateString() === new Date().toDateString() && (
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date(account.dates.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-400 opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-500`}></span>
        </div>
      )}
    </TableRow>
  );
};

export default LiveRow;
