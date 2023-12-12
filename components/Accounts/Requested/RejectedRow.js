"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const RejectedRow = ({ account }) => {
  const { UpdateAccounts } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const DeleteRejectedAccount = async (event) => {
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
      successNotification("Account successfully deleted");
      await UpdateAccounts();
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
        <div className="text-gray-500">Rejected</div>
        <div>{account.comment}</div>
      </div>
      <button onClick={(e) => DeleteRejectedAccount(e)} className="flex items-center btn-decline gap-2">
        <Image src="/reject-white.svg" width={18} height={18} alt="spinner" sizes="32x32" />
        <div>Delete</div>
      </button>
    </TableRow>
  );
};

export default RejectedRow;
