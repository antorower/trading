"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";

const LiveRow = ({ account }) => {
  let actionElement;
  if (account.openTrade.pending) {
    // Αν υπάρχει ανοιχτό trade
    account.commnet = "To vradi kleise to trade kai enimerose to balance sou"; // 666: Aplo delete auti i grammi
    actionElement = (
      <div className="flex flex-col gap-2 items-center">
        <div className="text-gray-500 text-sm">Close Trade</div>
        <div className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}></span>
        </div>
      </div>
    );
  } else if (!account.needTrade) {
    // Αν δεν χρειάζεται trade
    account.commnet = "Auto to account den xreiazetai trade simera"; // 666: Aplo delete auti i grammi
    actionElement = (
      <div className="flex flex-col gap-2 items-center">
        <Image src="/tick.svg" width={20} height={20} alt="tick" />
      </div>
    );
  } else if (account.needTrade) {
    // Αν χρειάζεται trade αλλά έχει ανοίξει ήδη σήμερα
    account.commnet = "Exeis idi anoiksei kai kleisei trade simera"; // 666: Aplo delete auti i grammi
    if (new Date(account.lastTradeOpenDate).toDateString() === new Date().toDateString()) {
      actionElement = (
        <div className="flex flex-col gap-2 items-center">
          <Image src="/tick.svg" width={20} height={20} alt="tick" />
        </div>
      );
    } else {
      // Αν χρειάζεται trade και δεν έχει ανοίξει ακόμα
      account.commnet = "Anoikse trade an i mera kai i ora to epitrepei"; // 666: Aplo delete auti i grammi
      actionElement = (
        <div onClick={() => console.log("Good!")} className="flex flex-col gap-2 items-center cursor-pointer">
          <div className="text-gray-500 text-sm">Open Trade</div>
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 bg-sky-500`}></span>
          </div>
        </div>
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
