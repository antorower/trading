"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import PaymentRow from "./PaymentRow";

const PaymentTable = () => {
  const [paymentAccountsPanelExpanded, setPaymentAccountsPanelExpanded] = useState(true);
  const [paymentAccounts, setPaymentAccounts] = useState(null);
  const { userAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!userAccounts) return;
    const payment = userAccounts.filter((account) => account.status === "Payment" || account.status === "Payout");
    setPaymentAccounts(payment);
  }, [userAccounts]);

  if (!paymentAccounts || paymentAccounts?.length === 0) {
    return null;
  }

  return (
    <TableWrapper title="Payout Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={paymentAccountsPanelExpanded} setPanelExpanded={setPaymentAccountsPanelExpanded}>
      {paymentAccounts && paymentAccounts.length > 0 && paymentAccounts.map((account) => <PaymentRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default PaymentTable;
