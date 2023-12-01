"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useAdminContext } from "@/context/AdminContext";
import Image from "next/image";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";
import CopyWallet from "../CopyWallet";

const RequestedAccountsTable = () => {
  const { users, activeAccounts, UpdateActiveAccounts } = useAdminContext();
  const [requestedAccounts, setRequestedAccounts] = useState(null);
  const [requestedAccountsPanelExpanded, setRequestedAccountsPanelExpanded] = useState(true);
  const [company, setCompany] = useState("Funding Pips");
  const [capital, setCapital] = useState(null);
  const [cost, setCost] = useState(null);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    if (!activeAccounts) return;
    setRequestedAccounts(activeAccounts.filter((account) => account.status === "Requested" || account.status === "Registration"));
  }, [activeAccounts]);

  const GetUser = (username) => {
    return users.find((user) => user.username === username);
  };

  const RefreshAccounts = async () => {
    const response = await UpdateActiveAccounts();
    if (response) {
      successNotification("Users successfully updated.");
    }
    if (!response) {
      errorNotification("Failed to update users. Please try again.");
    }
  };

  const SendMoney = async (event, id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/accounts/account/send-money`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, company: company, capital: capital, wallet: wallet, cost: cost }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("Money successfully sended");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  if (users && activeAccounts && requestedAccounts && requestedAccounts.length > 0) {
    return (
      <TableWrapper title="Requested Accounts" refresh={true} refreshFunction={RefreshAccounts} panelExpanded={requestedAccountsPanelExpanded} setPanelExpanded={setRequestedAccountsPanelExpanded}>
        <div className="flex flex-col gap-4 overflow-y-auto scrollable max-h-[400px]">
          {requestedAccountsPanelExpanded &&
            requestedAccounts.map((account) => (
              <TableRow>
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-4 items-center">
                    <div className="w-[50px] h-[50px] text-lg font-weight-700 flex items-center relative">
                      <Image src={GetUser(account.username).imageUrl} fill="true" className="rounded-full" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="text-lg font-weight-700">{account.username}</div>
                      <div className="text-sm text-gray-500">
                        {account.lastName} {account.firstName}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center">
                    <div className="text-gray-500 text-sm">{account.status === "Requested" ? "Requested Date" : "Money Transfered Date"}</div>
                    <div className="font-weight-700">{new Date(account.createdDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>

                  {account.status === "Requested" && (
                    <>
                      <CopyWallet wallet="wowow" />

                      <form onSubmit={(e) => SendMoney(e, account._id)} className="flex items-center space-x-4">
                        <select className="bg-gray-700 text-white rounded-lg p-2">
                          <option value="">Funding Pips</option>
                          <option value="">Fundex Next</option>
                          <option value="">FTMO</option>
                          <option value="">The Funded Trader</option>
                          <option value="">True Forex Funds</option>
                          <option value="">My Forex Funds</option>
                        </select>

                        <input type="number" step="1000" className="bg-gray-700 text-white rounded-lg p-2 w-[100px]" placeholder="Capital" />
                        <input type="number" className="bg-gray-700 text-white rounded-lg p-2 w-[80px]" placeholder="Cost" />

                        <button type="submit" className="btn-primary">
                          Transfer Money
                        </button>
                      </form>
                    </>
                  )}

                  <div className="flex gap-8 justify-between items-center">
                    <div className={`relative w-[22px] h-[22px] ${account.status === "Requested" && "animate-spin"}`}>
                      <Image src={`/${account.status === "Requested" ? "spinner" : "tick"}.svg`} fill="true" alt="spinner" />
                    </div>
                  </div>
                </div>
              </TableRow>
            ))}
        </div>
      </TableWrapper>
    );
  } else {
    return null;
  }
};

export default RequestedAccountsTable;

/*return<div className="flex justify-center items-center relative w-[22px] h-[22px] animate-spin">
        <Image src="/spinner.svg" fill="true" alt="spinner" />
      </div>;*/
