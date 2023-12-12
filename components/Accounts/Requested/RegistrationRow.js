"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";

const RegistrationRow = ({ account }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const { UpdateAccounts } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const RegisterAccount = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress/register-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: account._id, accountNumber: accountNumber }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("You have successfully register your account");
    } catch (error) {
      errorNotification(error.message);
    }
  };
  return (
    <TableRow>
      <div className="flex justify-center items-center gap-2">
        <div class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </div>
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col">
          <div className="font-weight-500 text-lg">{account.company}</div>
          <div className="text-gray-500 text-sm">{new Date(account.moneyTransferDetails.transferDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-[550px]">
        <div className="text-gray-500">Account Registration</div>
        <div className="text-center">{account.comment}</div>
      </div>
      <div className="flex items-center gap-4">
        <input placeholder="Account Number" onChange={(e) => setAccountNumber(e.target.value)} value={accountNumber} type="text" className="text-input" />
        <button onClick={(e) => RegisterAccount(e)} className="flex items-center btn-accept gap-2">
          <Image src="/edit.svg" width={18} height={18} alt="spinner" sizes="32x32" />
          <div>Register</div>
        </button>
      </div>
    </TableRow>
  );
};

export default RegistrationRow;
