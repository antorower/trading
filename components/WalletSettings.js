"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import Title from "@/components/Title";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";
import CopyWallet from "./CopyWallet";

const WalletSettings = () => {
  const [walletPanelExpanded, setWalletPanelExpanded] = useState(true);
  const [wallet, setWallet] = useState("");
  const [latestWallet, setLatestWallet] = useState("");
  const [isWalletUpdating, setIsWalletUpdating] = useState(false);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const GetWallet = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-wallet`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setWallet(data.wallet);
      setLatestWallet(data.wallet);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const UpdateWallet = async (event) => {
    setIsWalletUpdating(true);
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet: wallet }),
      });
      console.log(response);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("Your wallet has been successfully updated");
      await GetWallet();
      setIsWalletUpdating(false);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  useEffect(() => {
    GetWallet();
  }, []);

  return (
    <TableWrapper title="Your Personal Wallet" refresh={true} refreshFuntion={GetWallet} panelExpanded={walletPanelExpanded} setPanelExpanded={setWalletPanelExpanded}>
      {walletPanelExpanded && (
        <TableRow>
          <div className="flex w-full justify-between items-center">
            <div className="font-weight-500 text-lg"> Ethereum Wallet: </div>
            <input onChange={(e) => setWallet(e.target.value)} value={wallet} type="text" className="text-input w-[350px]" />
            <div className="text-sm font-weight-500">Your remunerations will be elegantly dispatched to this wallet on a weekly basis</div>
            <button onClick={(e) => UpdateWallet(e)} className="btn-accept">
              Update Wallet
            </button>
          </div>
        </TableRow>
      )}
      <div className="flex justify-end items-center text-xs">* Please ensure that the wallet address you provide is correct and supports the Ethereum blockchain and ETH token. We bear no responsibility for any losses due to an incorrect wallet address provided</div>
    </TableWrapper>
  );
};

export default WalletSettings;
