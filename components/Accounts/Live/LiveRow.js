"use client";
import React, { useState } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

const LiveRow = ({ account }) => {
  const [newBalance, setNewBalance] = useState(0);
  const { UpdateAccounts } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const OpenTrade = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/open-trade/${account.number}/${Math.floor(account.balance)}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      await UpdateAccounts();
      successNotification("To trade sou einai etoimo");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const CloseTrade = async () => {
    if (newBalance < 4000) {
      errorNotification("Enimerose to neo balance sou");
      return;
    }
    try {
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/close-trade/${account.number}/${Math.floor(int(newBalance))}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/close-trade/${account.number}/${Math.floor(newBalance)}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      await UpdateAccounts();
      successNotification("To trade sou ekleise");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  let actionElement;
  if (account.openTrade.pending) {
    // Αν υπάρχει ανοιχτό trade
    account.comment = "To vradi kleise to trade kai enimerose to balance sou"; // 666: Aplo delete auti i grammi
    actionElement = (
      <div className="flex flex-col gap-4">
        <button onClick={CloseTrade} className="flex flex-col gap-2 items-center cursor-pointer">
          <div className="text-gray-500 text-sm">Close Trade</div>
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}></span>
          </div>
        </button>
        <input placeholder="New Balance" type="number" className="number-input" onChange={(e) => setNewBalance(e.target.value)} value={newBalance} />
      </div>
    );
  } else if (!account.needTrade) {
    // Αν δεν χρειάζεται trade
    account.comment = "Auto to account den xreiazetai trade simera"; // 666: Aplo delete auti i grammi
    actionElement = (
      <div className="flex flex-col gap-2 items-center">
        <Image src="/tick.svg" width={20} height={20} alt="tick" />
      </div>
    );
  } else if (account.needTrade) {
    // Αν χρειάζεται trade αλλά έχει ανοίξει ήδη σήμερα
    account.comment = "Exeis idi anoiksei kai kleisei trade simera"; // 666: Aplo delete auti i grammi
    if (new Date(account.lastTradeOpenDate).toDateString() === new Date().toDateString()) {
      actionElement = (
        <div className="flex flex-col gap-2 items-center">
          <Image src="/tick.svg" width={20} height={20} alt="tick" />
        </div>
      );
    } else {
      // Αν χρειάζεται trade και δεν έχει ανοίξει ακόμα
      account.comment = "Anoikse trade an i mera kai i ora to epitrepei"; // 666: Aplo delete auti i grammi
      actionElement = (
        <button onClick={OpenTrade} className="flex flex-col gap-2 items-center cursor-pointer">
          <div className="text-gray-500 text-sm">Open Trade</div>
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}></span>
          </div>
        </button>
      );
    }
  } else {
    // Σε κάθε άλλη περίπτωση
    actionElement = (
      <div className="flex flex-col gap-2 items-center">
        <Image src="/reject-red.svg" width={20} height={20} alt="tick" />
      </div>
    );
  }

  return (
    <TableRow>
      <div className="flex gap-2">
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col items-start">
          <div>{account.company}</div>
          <div className="text-gray-500 text-sm">Live</div>
        </div>
      </div>

      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Account Number:</div>
          <div>{account.number}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-16">
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

        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Target</div>
          <div>${account.target}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Open Trade</div>
          {account.openTrade.pending ? (
            <div className="flex flex-col gap-3 items-center">
              <div>{account.openTrade.pair}</div>
              <div>Volume: {account.openTrade.lots}</div>
              <div className="flex gap-3 justify-center">
                <div className="text-red-600">
                  Stop Loss: -{account.openTrade.stopLoss} {account.openTrade.position === "Buy" ? "(katw)" : "(panw)"}
                </div>
                <div>-</div>
                <div className="text-green-400">
                  Take Profit: {account.openTrade.takeProfit} {account.openTrade.position === "Buy" ? "(panw)" : "(katw)"}
                </div>
              </div>
              <div>Position: {account.openTrade.position}</div>
            </div>
          ) : (
            <div>-</div>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-gray-500 w-[300px] text-sm text-center">{account.comment}</div>
      </div>

      {actionElement}
    </TableRow>
  );
};

export default LiveRow;
