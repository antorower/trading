"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import PayoutRow from "./PayoutRow";

const PayoutTable = () => {
  const [payoutAccountsPanelExpanded, setPayoutAccountsPanelExpanded] = useState(true);
  const [payoutAccounts, setPayoutAccounts] = useState(null);
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const payout = adminAccounts.filter((account) => account.status === "Payout");
    setPayoutAccounts(payout);
  }, [adminAccounts]);

  if (!payoutAccounts || payoutAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Payout Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={payoutAccountsPanelExpanded} setPanelExpanded={setPayoutAccountsPanelExpanded}>
      {payoutAccounts && payoutAccounts.length > 0 && payoutAccounts.map((account) => <PayoutRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default PayoutTable;
