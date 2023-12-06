"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import LostRow from "./LostRow";

const LostTable = () => {
  const [lostAccountsPanelExpanded, setLostAccountsPanelExpanded] = useState(true);
  const [lostAccounts, setLostAccounts] = useState(null);
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const lost = adminAccounts.filter((account) => account.status === "Review");
    setLostAccounts(lost);
  }, [adminAccounts]);

  if (!lostAccounts || lostAccounts.length === 0) return null;

  return (
    <TableWrapper title="Lost Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={lostAccountsPanelExpanded} setPanelExpanded={setLostAccountsPanelExpanded}>
      {lostAccounts && lostAccounts.length > 0 && lostAccounts.map((account) => <LostRow key={account._id} account={account} />)}
      {lostAccounts && lostAccounts.length === 0 && <div className="flex w-full justify-center items-center">There is no losted accounts at the moment</div>}
    </TableWrapper>
  );
};

export default LostTable;
