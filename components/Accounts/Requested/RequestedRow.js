"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const RequestedRow = ({ account }) => {
  const { UpdateAccounts } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const DeleteRequestedAccount = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-account/${account._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col">
          <div className="font-weight-500 text-lg">{account.company}</div>
          <div className="text-gray-500 text-sm">{new Date(account.createdDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-gray-500">Please wait</div>
        <div>{account.comment}</div>
      </div>
      <div className="flex gap-8">
        <div className="relative w-[22px] h-[22px] animate-spin">
          <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
        </div>
        <button onClick={(e) => DeleteRequestedAccount(e)} className="flex items-center">
          <Image src="/reject-white.svg" width={18} height={18} alt="spinner" sizes="32x32" />
        </button>
      </div>
    </TableRow>
  );
};

export default RequestedRow;
