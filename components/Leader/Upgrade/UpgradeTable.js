"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import UpgradeRow from "./UpgradeRow";

const UpgradeTable = () => {
  const [upgradeAccountsPanelExpanded, setUpgradeAccountsPanelExpanded] = useState(true);
  const [upgradeAccounts, setUpgradeAccounts] = useState(null);
  const { teamAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!teamAccounts) return;
    const upgrade = teamAccounts.filter((account) => account.status === "Upgrade");
    setUpgradeAccounts(upgrade);
    console.log("TEAM ACCOUNTS", upgrade);
  }, [teamAccounts]);

  if (!upgradeAccounts || upgradeAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Upgrade Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={upgradeAccountsPanelExpanded} setPanelExpanded={setUpgradeAccountsPanelExpanded}>
      {upgradeAccounts && upgradeAccounts.length > 0 && upgradeAccounts.map((account) => <UpgradeRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default UpgradeTable;
