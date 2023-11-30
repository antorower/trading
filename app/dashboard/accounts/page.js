"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";
import TableRow from "@/components/TableRow";
import { useUserContext } from "@/context/UserContext";

const Accounts = () => {
  const { activeAccounts, UpdateActiveAccounts } = useUserContext();
  console.log("From Page", activeAccounts);
  const [requestedCompany, setRequestedCompany] = useState("Funding Pips");

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const RequestNewAccount = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/request-new-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: requestedCompany }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("Your request for a new account is now being processed. Funds will be transferred to your wallet at the earliest convenience.");
      await UpdateActiveAccounts();
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Account Control Center" subtitle="Manage your accounts" />

      <TableWrapper title="Action Required" refresh={true} refreshFunction={() => console.log("shit")}></TableWrapper>

      <TableWrapper title="Requested Accounts" refresh={true} refreshFunction={() => console.log("shit")}>
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => setRequestedCompany("Funding Pips")}
              checked={requestedCompany === "Funding Pips"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">Funding Pips</div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              disabled
              onChange={() => setRequestedCompany("Funded Next")}
              checked={requestedCompany === "Funded Next"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">Funded Next</div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => setRequestedCompany("FTMO")}
              checked={requestedCompany === "FTMO"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">FTMO</div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => setRequestedCompany("The Funded Trader")}
              checked={requestedCompany === "The Funded Trader"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">The Funded Trader</div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => setRequestedCompany("True Forex Funds")}
              checked={requestedCompany === "True Forex Funds"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">True Forex Funds</div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => setRequestedCompany("My Forex Funds")}
              checked={requestedCompany === "My Forex Funds"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">My Forex Funds</div>
          </div>
          <button onClick={(e) => RequestNewAccount(e)} className="btn-primary">
            New Account
          </button>
        </div>
        {activeAccounts &&
          activeAccounts.length > 0 &&
          activeAccounts.some((account) => account.status === "Requested" || account.status === "Registration") && (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollable">
              {activeAccounts.map((account) => {
                if (account.status === "Requested" || account.status === "Registration") {
                  return (
                    <TableRow key={account.id}>
                      <div className="flex w-full justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="relative w-[30px] h-[30px]">
                            <Image src={`/${account.image}.svg`} fill="true" className="rounded-full" alt="company-logo" />
                          </div>
                          <div className="font-weight-500">{account.company}</div>
                        </div>

                        <div className="text-gray-400 font-weight-500">{account.status === "Requested" ? account.comment : account.action}</div>

                        <div className="flex gap-8 items-center">
                          {account.status === "Requested" && <button className="btn-decline"> Delete </button>}

                          <div className={`relative w-[22px] h-[22px] ${account.status === "Requested" && "animate-spin"}`}>
                            <Image src={`/${account.status === "Requested" ? "spinner" : "tick"}.svg`} fill="true" alt="spinner" />
                          </div>
                        </div>
                      </div>
                    </TableRow>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
      </TableWrapper>
    </div>
  );
};

export default Accounts;
