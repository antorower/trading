"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import TableWrapper from "../TableWrapper";
import TableRow from "../TableRow";

const UserTable = ({ user }) => {
  const [userTablePanelExpanded, setUserTablePanelExpanded] = useState(true);
  if (!user) {
    return null;
  }
  return (
    <TableWrapper title={"User Data"} refresh={true} refreshFunction={() => console.log("good")} panelExpanded={userTablePanelExpanded} setPanelExpanded={setUserTablePanelExpanded}>
      {userTablePanelExpanded && (
        <>
          <TableRow>
            <div className="flex gap-4">
              <div className="relative w-[50px] h-[50px]">
                <Image src={user.imageUrl} fill="true" alt="tick" className="rounded-full" />
              </div>
              <div className="flex flex-col justify-center">
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-gray-500 text-sm">{user.username}</div>
              </div>
            </div>
            <div className="flex gap-8">
              <button className="btn-primary">Accounts</button>
              <button className="btn-primary">Trades</button>
              <button className="btn-primary">Wallet</button>
            </div>
          </TableRow>
        </>
      )}
    </TableWrapper>
  );
};

export default UserTable;
