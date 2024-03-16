"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import PayoutRow from "./PayoutRow";
import TableRow from "@/components/TableRow";

const PayoutTable = () => {
  const [payoutAccountsPanelExpanded, setPayoutAccountsPanelExpanded] = useState(true);
  const [payoutAccounts, setPayoutAccounts] = useState(null);
  const [totalPayoutAccounts, setTotalPayoutAccounts] = useState(0);
  const [waitingProfits, setWaitingProfits] = useState(0);
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const payout = adminAccounts.filter((account) => account.status === "Payout" || account.status === "Payment");
    setPayoutAccounts(payout);

    setTotalPayoutAccounts(payout.length);

    const totalProfits = payout.reduce((sum, account) => sum + (account.balance - account.capital), 0);
    setWaitingProfits(totalProfits);
  }, [adminAccounts]);

  if (!payoutAccounts || payoutAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Payout Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={payoutAccountsPanelExpanded} setPanelExpanded={setPayoutAccountsPanelExpanded}>
      <TableRow>
        <div> Payout Accounts: {totalPayoutAccounts}</div>
        <div> Waiting Profits: {waitingProfits}</div>
      </TableRow>
      {payoutAccounts && payoutAccounts.length > 0 && payoutAccounts.map((account) => <PayoutRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default PayoutTable;
