"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const PayoutRow = ({ account }) => {
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const PayoutComplete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber: account.number }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("message");
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
          <div>${account.balance - account.capital}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Request Date</div>
          <div>{new Date(account.paymentedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>
      <button onClick={PayoutComplete} className="btn-accept">
        Payout Completed
      </button>
    </TableRow>
  );
};

export default PayoutRow;
