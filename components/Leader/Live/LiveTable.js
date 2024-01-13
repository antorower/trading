"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import LiveRow from "./LiveRow";

const LiveTable = () => {
  const [liveAccountsPanelExpanded, setLiveAccountsPanelExpanded] = useState(true);
  const [liveAccounts, setLiveAccounts] = useState(null);
  const { teamAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!teamAccounts) return;
    const live = teamAccounts.filter((account) => account.status === "Live");
    setLiveAccounts(live);
  }, [teamAccounts]);

  if (!liveAccounts || liveAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Live Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={liveAccountsPanelExpanded} setPanelExpanded={setLiveAccountsPanelExpanded}>
      {liveAccounts && liveAccounts.length > 0 && liveAccounts.map((account) => <LiveRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default LiveTable;
