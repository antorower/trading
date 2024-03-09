"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";

const UpgradeRow = ({ account }) => {
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const { UpdateAccounts } = useUserContext();
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const UpgradeAccount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upgrade-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newAccount: newAccountNumber, oldAccount: account.number }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("Your account has been upgraded successfully");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const HideAccount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hide-upgraded-account`, {
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
      successNotification("Upgraded account successfully deleted");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex gap-2 items-center">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </div>
        <div className="flex w-10 h-10 justify-center items-center relative">
          <Image src={`/${account.image}.svg`} fill="true" sizes="32x32" className="rounded-full" alt="account" />
        </div>
        <div className="flex flex-col items-start">
          <div>{account.company}</div>
          <div className="text-gray-500 text-sm">{account.status === "Upgrade" ? "Upgrade" : "Upgraded"}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-16">
        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Account Number</div>
          <div>{account.number}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-gray-500 text-sm">Phase</div>
          {account.phase === 1 && "Student"}
          {account.phase === 2 && "Practitioner"}
          {account.phase === 3 && "Master"}
        </div>

        {account.status === "Upgrade" && (
          <div className="flex flex-col items-center">
            <div className="text-sm text-blue-400">Upgrade</div>
            <div>{new Date(account.upgradeDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
        )}

        {account.status === "Upgraded" && (
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">Upgraded</div>
            <div>{new Date(account.upgradedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center w-[400px] text-center">{account.comment}</div>

      {account.status === "Upgrade" && (
        <div className="flex items-center gap-4">
          <input value={newAccountNumber} onChange={(e) => setNewAccountNumber(e.target.value)} type="text" className="text-input" />
          <button onClick={UpgradeAccount} className="btn-accept">
            Upgrade
          </button>
        </div>
      )}

      {account.status === "Upgraded" && (
        <button onClick={HideAccount} className="btn-decline">
          Delete
        </button>
      )}
    </TableRow>
  );
};

export default UpgradeRow;

/*


{account.status === "Upgrade" && (
        <>
          <div className="flex flex-col items-center">
            <div className="text-gray-500 text-sm">Trading Days Left</div>
            <div>{account.minimumTrades - account.tradesExecuted > 0 ? account.minimumTrades - account.tradesExecuted : 0}</div>
          </div>
          <div className="flex gap-4">
            <input onChange={(e) => setNewAccountNumber(e.target.value)} value={newAccountNumber} type="text" placeholder="New account number" className="text-input" />
            <button onClick={UpgradeAccount} className="btn-accept">
              Upgrade
            </button>
          </div>
        </>
      )}


       {account.status === "Upgraded" && <div>aksdfjkadlsj</div>}
      */
