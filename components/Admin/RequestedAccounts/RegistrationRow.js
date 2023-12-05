"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";

const RegistrationRow = ({ account }) => {
  const { UpdateAccounts } = useUserContext();
  const [company, setCompany] = useState("Funding Pips");
  const [capital, setCapital] = useState();
  const [cost, setCost] = useState();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const SendMoney = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/send-money-to-buy-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: account._id, company, capital, wallet: account.user.publicMetadata.wallet, amount: cost }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("Money successfully sended");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex gap-4 items-center justify-center">
        <div className="relative w-[40px] h-[40px] flex justify-center items-center">
          <Image src={account.user.imageUrl} alt="user-image" fill="true" className="rounded-full" />
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
          <div className="text-gray-500 text-sm">Company</div>
          <div>{account.company}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Capital</div>
          <div>${account.capital}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Date</div>
          <div>{new Date(account.createdDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Amount</div>
          <div>${account.moneyTransferDetails.transferAmount}</div>
        </div>
      </div>
      <div className="relative w-[22px] h-[22px] animate-spin">
        <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
      </div>
    </TableRow>
  );
};

export default RegistrationRow;
