"use client";
import React, { useState } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

const PaymentRow = ({ account }) => {
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);
  const [wallet, setWallet] = useState("");
  const { UpdateAccounts } = useUserContext();

  const PaymentRequest = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber: account.number, wallet }),
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
      <div className="flex justify-center items-center gap-2">
        {account.status === "Payment" && (
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </div>
        )}
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col">
          <div className="font-weight-500 text-lg">{account.company}</div>
          <div className="text-gray-500 text-sm">{account.status === "Payment" ? new Date(account.targetReachedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : new Date(account.paymentedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-16">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-sm">Account Number:</div>
            <div>{account.number}</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Balance</div>
          <div>${account.balance}</div>
        </div>

        {account.status === "Payment" && (
          <div className="flex flex-col items-center">
            <div className="text-blue-400 text-sm">Payout Request</div>
            <div>{new Date(account.paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="text-gray-500 text-sm w-[400px] text-center">Send profits to bybit with UID: 155315263</div>
      </div>

      {/*{account.status === "Payment" && <input type="text" className="text-input" placeholder="Wallet" value={wallet} onChange={(e) => setWallet(e.target.value)} />}*/}

      {account.status === "Payment" && (
        <button onClick={PaymentRequest} className="btn-accept">
          I sent the profits
        </button>
      )}

      {account.status === "Payout" && (
        <div className="relative w-[22px] h-[22px] animate-spin">
          <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
        </div>
      )}
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
