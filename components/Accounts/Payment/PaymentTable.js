"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import PaymentRow from "./PaymentRow";

const PaymentTable = () => {
  const [paymentAccountsPanelExpanded, setPaymentAccountsPanelExpanded] = useState(true);
  const [paymentAccounts, setPaymentAccounts] = useState(null);
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const payment = adminAccounts.filter((account) => account.status === "Payment" || account.status === "Payout");
    setPaymentAccounts(payment);
  }, [adminAccounts]);

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
