"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import LostRow from "./LostRow";

const LostTable = () => {
  const [lostAccountsPanelExpanded, setLostAccountsPanelExpanded] = useState(true);
  const [lostAccounts, setLostAccounts] = useState(null);
  const { userAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!userAccounts) return;
    const lost = userAccounts.filter((account) => account.status === "Review" || account.status === "Lost");
    setLostAccounts(lost);
  }, [userAccounts]);

  if (!lostAccounts || lostAccounts.length === 0) return null;

  return (
    <TableWrapper title="Lost Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={lostAccountsPanelExpanded} setPanelExpanded={setLostAccountsPanelExpanded}>
      {lostAccounts && lostAccounts.length > 0 && lostAccounts.map((account) => <LostRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default LostTable;
