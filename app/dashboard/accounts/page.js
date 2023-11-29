"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";
import TableRow from "@/components/TableRow";

const Accounts = async () => {
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
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Account Control Center" subtitle="Manage your accounts" />

      <TableWrapper title="Action Required" refresh={true} refreshFunction={() => console.log("shit")}></TableWrapper>

      <TableWrapper title="Requested Accounts" refresh={true} refreshFunction={() => console.log("shit")}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => setRequestedCompany("Funding Pips")}
              checked={requestedCompany === "Funding Pips"}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-sm cursor-pointer"
            />
            <div className="font-weight-500 text-lg">Funding Pips</div>
          </div>
          <button onClick={(e) => RequestNewAccount(e)} className="btn-primary">
            New Account
          </button>
        </div>
        {/*Αν υπαρχουν τοτε τα κανω render αλλιως κανω ενα κειμενακι*/}
        {true && (
          <TableRow>
            <div className="relative w-[30px] h-[30px]">
              <Image src="/admin.svg" fill="true" className="rounded-full" />
            </div>
          </TableRow>
        )}
        {false && null}
      </TableWrapper>
    </div>
  );
};

export default Accounts;
