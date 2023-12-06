"use client";
import React, { useState } from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import CopyWallet from "@/components/CopyWallet";

const RequestedRow = ({ account }) => {
  const { UpdateAccounts } = useUserContext();
  const [company, setCompany] = useState("Funding Pips");
  const [capital, setCapital] = useState();
  const [cost, setCost] = useState();
  const [declineComment, setDeclineComment] = useState();

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

  const RejectAccount = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reject-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: account._id, comment: declineComment }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("Account successfully rejected");
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
      <div className="text-gray-500">{new Date(account.dates.createdDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
      <div className="flex gap-8 items-center">
        <select onChange={(e) => setCompany(e.target.value)} className="select border border-gray-500">
          <option value="Funding Pips">Funding Pips</option>
        </select>
        <input placeholder="Capital" type="number" className="number-input" onChange={(e) => setCapital(e.target.value)} value={capital || null} />
        <input placeholder="Cost" type="number" className="number-input" onChange={(e) => setCost(e.target.value)} value={cost || null} />
        <CopyWallet wallet={account.user.publicMetadata.wallet} />
      </div>
      <input onChange={(e) => setDeclineComment(e.target.value)} value={declineComment} type="text" className="text-input" placeholder="Decline Comment" />
      <div className="flex justify-center items-center gap-4">
        <button onClick={(e) => RejectAccount(e)} className="btn-decline">
          {" "}
          Reject{" "}
        </button>
        <button onClick={(e) => SendMoney(e)} className="btn-accept flex gap-2 items-center">
          <Image src="/dollar2.svg" alt="money" width={25} height={25} />
          <div>Send Money</div>
        </button>
      </div>
    </TableRow>
  );
};

export default RequestedRow;
