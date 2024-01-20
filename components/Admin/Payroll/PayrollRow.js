"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const PayrollRow = ({ user }) => {
  const { UpdateUsers } = useUserContext();
  const [profit, setProfit] = useState();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const ChangePayrollState = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/change-payroll-state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, state: user.publicMetadata.payroll }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateUsers();
      successNotification(`${user.username} state successfully changed`);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const PayUser = async () => {
    if (!profit) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pay-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, wallet: user.publicMetadata.personalEthereumWallet, amount: profit }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification(`You have successfully pay ${user.username}`);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const GetUserProfit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-profits/${user.id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setProfit(data.profit);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex gap-4 items-center justify-center">
        <div className="relative w-[40px] h-[40px] flex justify-center items-center">
          <Image src="/avatar.svg" alt="user-image" fill="true" sizes="32x32" className="rounded-full" />
        </div>
        <div className="flex flex-col">
          <div className="">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-gray-500 text-sm">{user.username}</div>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <div>Last Payday:</div>
        {new Date(user.publicMetadata.payday).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
      </div>
      {profit && (
        <div className="flex flex-col justify-center">
          <div className="text-center">Profit</div>
          <div>${profit}</div>
        </div>
      )}
      <div className="flex gap-4">
        <button onClick={() => GetUserProfit()} className="btn-primary">
          Update Profit
        </button>
        {user.publicMetadata.payroll && (
          <button onClick={() => PayUser()} className="btn-accept">
            Pay User
          </button>
        )}
        <button onClick={() => ChangePayrollState()} className={user.publicMetadata.payroll ? "btn-decline" : "btn-accept"}>
          {user.publicMetadata.payroll ? "Remove" : "Add"}
        </button>
      </div>
    </TableRow>
  );
};

export default PayrollRow;
