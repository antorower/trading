"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

const RequestNewAccountBar = () => {
  const [company, setCompany] = useState("Funding Pips");
  const { UpdateAccounts } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const RequestNewAccount = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request-new-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: company }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateAccounts();
      successNotification("Funds will be transferred to your wallet at the earliest convenience.");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <div className="flex w-full justify-end pr-0 items-center gap-4">
      <select onChange={(e) => setCompany(e.target.value)} className="select">
        <option value="Funding Pips">Funding Pips</option>
      </select>
      <button onClick={(e) => RequestNewAccount(e)} className="btn-primary">
        New Account
      </button>
    </div>
  );
};

export default RequestNewAccountBar;
