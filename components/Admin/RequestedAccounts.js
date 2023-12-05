"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";
import CopyWallet from "../CopyWallet";

const RequestedAccountsTable = () => {
  const { users, adminAccounts, UpdateAccounts } = useUserContext();
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

  const GetUserByUsername = (username) => {
    return users.find((user) => user.username === username);
  };

  const GetUserById = (id) => {
    return users.find((user) => user.id === id);
  };

  const RefreshAccounts = async () => {
    const response = await UpdateActiveAccounts();
    if (!response) {
      errorNotification("Failed to update accounts. Please try again.");
    }
  };

  const SendMoney = async (event, accountId, wallet) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/accounts/account/send-money`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: accountId, company: company, capital: capital, wallet: wallet, amount: cost }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("Money successfully sended");
      RefreshAccounts();
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
              <TableRow key={account._id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-4 items-center">
                    <div className="w-[50px] h-[50px] text-lg font-weight-700 flex items-center relative">
                      <Image src={GetUserByUsername(account.username).imageUrl} fill="true" sizes="32x32" className="rounded-full" alt="image" />
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

                  {account.status === "Registration" && (
                    <>
                      <div className="flex flex-col items-center">
                        <div className="text-gray-500">Mentor</div>
                        <div className="font-weight-500 text-lg"> {GetUserById(account.user.publicMetadata.mentor).username}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-gray-500">{account.company}</div>
                        <div>${account.capital}</div>
                      </div>
                    </>
                  )}

                  {account.status === "Requested" && (
                    <>
                      <CopyWallet wallet={account.user.publicMetadata.wallet} />

                      <form onSubmit={(e) => SendMoney(e, account._id, account.user.publicMetadata.wallet)} className="flex items-center space-x-4">
                        <select onChange={(e) => setCompany(e.target.value)} value={company} className="bg-gray-700 text-white rounded-lg p-2">
                          <option value="Funding Pips">Funding Pips</option>
                          <option value="Funded Next">Fundex Next</option>
                          <option value="FTMO">FTMO</option>
                          <option value="The Funded Trader">The Funded Trader</option>
                          <option value="True Forex Funds">True Forex Funds</option>
                          <option value="My Forex Funds">My Forex Funds</option>
                        </select>

                        <input onChange={(e) => setCapital(e.target.value)} type="number" step="1000" className="bg-gray-700 text-white rounded-lg p-2 w-[100px]" placeholder="Capital" />
                        <input onChange={(e) => setCost(e.target.value)} type="number" className="bg-gray-700 text-white rounded-lg p-2 w-[80px]" placeholder="Cost" />

                        <button type="submit" className="btn-primary">
                          Transfer Money
                        </button>
                      </form>
                    </>
                  )}

                  <div className="flex gap-8 justify-between items-center">
                    <div className={`relative w-[22px] h-[22px] ${account.status === "Requested" && "animate-spin"}`}>
                      <Image src={`/${account.status === "Requested" ? "spinner" : "tick"}.svg`} fill="true" sizes="32x32" alt="spinner" />
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
