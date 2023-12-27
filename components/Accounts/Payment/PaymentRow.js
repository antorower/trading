"use client";
import React, { useState } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";
import CopyWallet from "@/components/CopyWallet";
import { useUser } from "@clerk/nextjs";

const PaymentRow = ({ account }) => {
  const [newAccount, setNewAccount] = useState("");
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);
  const { UpdateAccounts } = useUserContext();
  const { user } = useUser();

  const PaymentRequest = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-request`, {
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
      await UpdateAccounts();
      successNotification("You have successfully request a payout");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex w-10 h-10 justify-center items-center relative">
        <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="account" />
      </div>
      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Account Number:</div>
          <div>{account.number}</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-16">
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Company</div>
          <div>{account.company}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Phase</div>
          {account.phase === 1 && "Evaluation"}
          {account.phase === 2 && "Verification"}
          {account.phase === 3 && "Funded"}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Balance</div>
          <div>${account.balance}</div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-gray-500 text-sm w-[300px] text-center">{account.comment}</div>
      </div>
      <div className="flex gap-14">
        <div className="flex items-center justify-center flex-grow gap-16">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-gray-500 text-sm">Open Trade</div>
            {new Date(account.lastTradeOpenDate).toDateString() === new Date().toDateString() ? (
              <Image src="/tick.svg" width={20} height={20} alt="tick" />
            ) : (
              <div className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-400 opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-500`}></span>
              </div>
            )}
          </div>
          {new Date(account.lastTradeOpenDate).toDateString() === new Date().toDateString() && (
            <div className="flex flex-col gap-2 items-center">
              <div className="text-gray-500 text-sm">Close Trade</div>
              {new Date(account.lastTradeCloseDate).toDateString() === new Date().toDateString() ? (
                <Image src="/tick.svg" width={20} height={20} alt="tick" />
              ) : (
                <div className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-400 opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-500`}></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TableRow>
  );
};

export default PaymentRow;

/*

{new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ||
          (new Date(account.lastTradeCloseDate).toDateString() != new Date().toDateString() && (
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-400 opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-500`}></span>
            </div>
          ))}
          
          */

/*
          {new Date(account.lastTradeOpenDate).toDateString() === new Date().toDateString() && new Date(account.dates.lastTradeCloseDate).toDateString() === new Date().toDateString() && (
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${new Date(account.dates.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-400 opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 bg-${new Date(account.lastTradeOpenDate).toDateString() != new Date().toDateString() ? "sky" : "orange"}-500`}></span>
        </div>
      )}










         {account.status === "Payment" && <CopyWallet wallet={user.publicMetadata.teamWallet} />}
      {account.status === "Payment" && (
        <button onClick={PaymentRequest} className="btn-accept">
          Payout Request
        </button>
      )}
      */
