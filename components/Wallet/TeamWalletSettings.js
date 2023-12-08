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

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  return (
    <TableWrapper title="Payout Wallet" refresh={false} refreshFuntion={() => {}} panelExpanded={walletPanelExpanded} setPanelExpanded={setWalletPanelExpanded}>
      {walletPanelExpanded && (
        <TableRow>
          <div className="flex w-full justify-between items-center">
            <div className="font-weight-500 text-lg"> Ethereum Wallet: </div>
            {user && user.publicMetadata.teamWallet && user.publicMetadata.teamWallet}
            {user && !user.publicMetadata.teamWallet && <div>There is no wallet yet</div>}
            {user && user.publicMetadata.teamWallet && <CopyWallet wallet={user?.publicMetadata.teamWallet} />}
            <div className="text-sm font-weight-500">This wallet will be used for processing payments from all accounts</div>
          </div>
        </TableRow>
      )}
      <div className="flex justify-end items-center text-xs">* Please ensure that only Ethereum is transferred to this wallet</div>
    </TableWrapper>
  );
};

export default TeamWalletSettings;
