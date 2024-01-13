"use client";
import React, { useState } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

const PayoutRow = ({ account }) => {
  const [amount, setAmount] = useState("");
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);
  const { UpdateAccounts } = useUserContext();

  const PayoutComplete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accept-payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber: account.number, amount: amount }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("Payout complete");
    } catch (error) {
      errorNotification(error.message);
    }
  };

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
          <div className="text-gray-500 text-sm">Profit</div>
          <div>${(account.balance - account.target) * 0.8}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Paid Times</div>
          <div>{account.paidTimes}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Payment Date</div>
          {account.status === "Payment" && <div>{new Date(account.paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>}
          {account.status === "Payout" && <div>{new Date(account.paymentedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>}
        </div>
      </div>
      {account.status === "Payment" && (
        <div className="relative w-[22px] h-[22px] animate-spin">
          <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
        </div>
      )}
      {account.status === "Payout" && (
        <div className="flex gap-4">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="text-input" />
          <button onClick={PayoutComplete} className="btn-accept">
            Payout Completed
          </button>
        </div>
      )}
    </TableRow>
  );
};

export default PayoutRow;
