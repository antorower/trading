"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import UpgradeRow from "./UpgradeRow";
import TableRow from "@/components/TableRow";

const UpgradeTable = () => {
  const [upgradeAccountsPanelExpanded, setUpgradeAccountsPanelExpanded] = useState(true);
  const [upgradeAccounts, setUpgradeAccounts] = useState(null);
  const [phase1Upgrade, setPhase1Upgrade] = useState(0);
  const [phase2Upgrade, setPhase2Upgrade] = useState(0);
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const upgrade = adminAccounts.filter((account) => account.status === "Upgrade");
    setUpgradeAccounts(upgrade);

    const phase1UpgradeVar = adminAccounts.filter((account) => account.phase === 1);
    const phase2UpgradeVar = adminAccounts.filter((account) => account.phase === 2);
    setPhase1Upgrade(phase1UpgradeVar.length);
    setPhase2Upgrade(phase2UpgradeVar.length);
  }, [adminAccounts]);

  if (!upgradeAccounts || upgradeAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Upgrade Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={upgradeAccountsPanelExpanded} setPanelExpanded={setUpgradeAccountsPanelExpanded}>
      <TableRow>
        <div className="flex gap-6 justify-center items-center">
          <div>Phase 1: {phase1Upgrade}</div>
          <div>Phase 2: {phase2Upgrade}</div>
        </div>
      </TableRow>
      {upgradeAccounts && upgradeAccounts.length > 0 && upgradeAccounts.map((account) => <UpgradeRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default UpgradeTable;
