"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";

const LostRow = ({ account }) => {
  const { UpdateAccounts } = useUserContext();
  const { user } = useUser();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const HideLostedAccount = async (event) => {
    try {
      event.preventDefault();

      if (user?.publicMetadata.role === "admin") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/account-lost`, {
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
      }
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex justify-center items-center gap-2">
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col">
          <div className="font-weight-500 text-lg">{account.company}</div>
          <div className="text-gray-500 text-sm">{new Date(account.lostDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>
      <div>{account.number}</div>
      <div>{account.userId}</div>
      <div>{account.balance}</div>
      {user?.publicMetadata.permissions != "strict" && (
        <button onClick={(e) => HideLostedAccount(e)} className="flex items-center btn-decline gap-2">
          Lost
        </button>
      )}
    </TableRow>
  );
};

export default LostRow;
