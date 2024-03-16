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

    const phase1AccountsVar = live.filter((account) => account.phase === 1);
    const phase1GoodVar = phase1AccountsVar.filter((account) => account.balance >= account.capital * 1.036);
    const phase1BadVar = phase1AccountsVar.filter((account) => account.balance <= account.capital * 0.94);
    setPhase1Accounts(phase1AccountsVar.length);
    setPhase1Good(phase1GoodVar.length);
    setPhase1Bad(phase1BadVar.length);

    const phase2AccountsVar = live.filter((account) => account.phase === 2);
    const phase2GoodVar = phase2AccountsVar.filter((account) => account.balance >= account.capital);
    const phase2BadVar = phase2AccountsVar.filter((account) => account.balance <= account.capital * 0.94);
    setPhase2Accounts(phase2AccountsVar.length);
    setPhase2Good(phase2GoodVar.length);
    setPhase2Bad(phase2BadVar.length);

    const phase3AccountsVar = live.filter((account) => account.phase === 3);
    const phase3GoodVar = phase3AccountsVar.filter((account) => account.balance >= account.capital);
    const phase3BadVar = phase3AccountsVar.filter((account) => account.balance <= account.capital * 0.94);
    setPhase3Accounts(phase3AccountsVar.length);
    setPhase3Good(phase3GoodVar.length);
    setPhase3Bad(phase3BadVar.length);
  }, [adminAccounts]);

  if (!liveAccounts || liveAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Live Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={liveAccountsPanelExpanded} setPanelExpanded={setLiveAccountsPanelExpanded}>
      <TableRow>
        <div>
          Phase 1: {phase1Accounts} | Good: {phase1Good} | Bad: {phase1Bad}
        </div>
        <div>
          Phase 2: {phase2Accounts} | Good: {phase2Good} | Bad: {phase2Bad}
        </div>
        <div>
          Phase 3: {phase3Accounts} | Good: {phase3Good} | Bad: {phase3Bad}
        </div>
      </TableRow>
      {liveAccounts && liveAccounts.length > 0 && liveAccounts.map((account) => <LiveRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default LiveTable;
