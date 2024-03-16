"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import LiveRow from "./LiveRow";
import TableRow from "@/components/TableRow";

const LiveTable = () => {
  const [liveAccountsPanelExpanded, setLiveAccountsPanelExpanded] = useState(true);

  const [phase1Accounts, setPhase1Accounts] = useState(0);
  const [phase1Good, setPhase1Good] = useState(0);
  const [phase1Bad, setPhase1Bad] = useState(0);

  const [phase2Accounts, setPhase2Accounts] = useState(0);
  const [phase2Good, setPhase2Good] = useState(0);
  const [phase2Bad, setPhase2Bad] = useState(0);

  const [phase3Accounts, setPhase3Accounts] = useState(0);
  const [phase3Good, setPhase3Good] = useState(0);
  const [phase3Bad, setPhase3Bad] = useState(0);

  const [liveAccounts, setLiveAccounts] = useState(null);
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const live = adminAccounts.filter((account) => account.status === "Live");
    setLiveAccounts(live);

    const phase1AccountsVar = adminAccounts.filter((account) => account.phase === 1);
    const phase1GoodVar = phase1AccountsVar.filter((account) => account.balance >= account.target * 0.978);
    const phase1BadVar = phase1AccountsVar.filter((account) => account.balance <= account.capital * 0.94);
    setPhase1Accounts(phase1AccountsVar);
    setPhase1Good(phase1GoodVar);
    setPhase1Bad(phase1BadVar);
  }, [adminAccounts]);

  if (!liveAccounts || liveAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Live Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={liveAccountsPanelExpanded} setPanelExpanded={setLiveAccountsPanelExpanded}>
      <TableRow>
        <div>
          Phase 1 Accounts: {phase1Accounts} | Good: {phase1Good} | Bad: {phase1Bad}
        </div>
        <div>
          Phase 1 Accounts: {phase1Accounts} | Good: {phase1Good} | Bad: {phase1Bad}
        </div>
        <div>
          Phase 1 Accounts: {phase1Accounts} | Good: {phase1Good} | Bad: {phase1Bad}
        </div>
      </TableRow>
      {liveAccounts && liveAccounts.length > 0 && liveAccounts.map((account) => <LiveRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default LiveTable;
