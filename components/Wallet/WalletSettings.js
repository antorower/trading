"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";
import { useUser } from "@clerk/nextjs";

const WalletSettings = () => {
  const [walletPanelExpanded, setWalletPanelExpanded] = useState(true);
  const [wallet, setWallet] = useState(null);
  const { user } = useUser();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const UpdateWallet = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-wallet`, {
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
    } catch (error) {
      errorNotification(error.message);
    }
  };

  useEffect(() => {
    if(!user) return;
    setWallet(user.publicMetadata.wallet);
  }, [user]);

  return (
    <TableWrapper title="Your Personal Wallet" refresh={false} refreshFuntion={() => {}} panelExpanded={walletPanelExpanded} setPanelExpanded={setWalletPanelExpanded}>
      {walletPanelExpanded && (
        <TableRow>
          <div className="flex w-full justify-between items-center">
            <div className="font-weight-500 text-lg"> Ethereum Wallet: </div>
            <input onChange={(e) => setWallet(e.target.value)} value={wallet || ""} type="text" className="text-input w-[390px]" />
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
