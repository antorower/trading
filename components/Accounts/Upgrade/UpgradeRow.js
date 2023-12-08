"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const UpgradeRow = ({ account }) => {
  return (
    <TableRow>
      <div className="flex flex-col items-center">
        <div className="text-gray-500 text-sm">Account Number</div>
        <div>{account.number}</div>
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
          <div className="text-gray-500 text-sm">Upgrade Date</div>
          <div>{new Date(account.dates.upgradeDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>
    </TableRow>
  );
};

export default UpgradeRow;
