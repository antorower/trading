"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const LostRow = ({ account }) => {
  const { UpdateAccounts } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const DeleteLostedAccount = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hide-lost-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: account._id }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("Account successfully deleted");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex justify-center items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </div>
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col">
          <div className="font-weight-500 text-lg">{account.company}</div>
          <div className="text-gray-500 text-sm">{new Date(account.lostDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-gray-500">Your account lost</div>
        <div>{account.comment}</div>
      </div>
      <button onClick={(e) => DeleteLostedAccount(e)} className="flex items-center btn-decline gap-2">
        Delete
      </button>
    </TableRow>
  );
};

export default LostRow;
