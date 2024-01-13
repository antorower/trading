"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import PayoutRow from "./PayoutRow";

const PayoutTable = () => {
  const [payoutAccountsPanelExpanded, setPayoutAccountsPanelExpanded] = useState(true);
  const [payoutAccounts, setPayoutAccounts] = useState(null);
  const { teamAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!teamAccounts) return;
    const payout = teamAccounts.filter((account) => account.status === "Payout" || account.status === "Payment");
    setPayoutAccounts(payout);
  }, [teamAccounts]);

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
