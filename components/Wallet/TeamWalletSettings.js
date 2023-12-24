"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";
import CopyWallet from "../CopyWallet";
import { useUser } from "@clerk/nextjs";

const TeamWalletSettings = () => {
  const { user } = useUser();
  const [walletPanelExpanded, setWalletPanelExpanded] = useState(true);

  return (
    <TableWrapper title="Payout Wallets" refresh={false} refreshFuntion={() => {}} panelExpanded={walletPanelExpanded} setPanelExpanded={setWalletPanelExpanded}>
      {walletPanelExpanded && (
        <>
          <TableRow>
            <div className="flex w-full justify-between items-center">
              <div className="font-weight-500 text-lg"> Ethereum Wallet: </div>
              {user && user.publicMetadata.teamEthWallet.wallet && user.publicMetadata.teamEthWallet.wallet}
              {user && !user.publicMetadata.teamEthWallet.wallet && <div>There is no wallet yet</div>}
              {user && user.publicMetadata.teamEthWallet.wallet && <CopyWallet wallet={user?.publicMetadata.teamEthWallet.wallet} />}
              <div className="text-sm font-weight-500">This wallet is exclusively designed for executing Ethereum payout transactions</div>
            </div>
          </TableRow>
        </>
      )}
      <div className="flex justify-end items-center text-xs">* It is crucial to use wallets appropriately to ensure secure and efficient transactions </div>
    </TableWrapper>
  );
};

export default TeamWalletSettings;
