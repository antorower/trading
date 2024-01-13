"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import RequestedRow from "./RequestedRow";
import RegistrationRow from "./RegistrationRow";

const RequestedTable = () => {
  const [requestedAccountsPanelExpanded, setRequestedAccountsPanelExpanded] = useState(true);
  const [registrationAccounts, setRegistrationAccounts] = useState(null);
  const [requestedAccounts, setRequestedAccounts] = useState(null);
  const { teamAccounts, UpdateAccounts } = useUserContext();
  console.log("TA:", teamAccounts);
  useEffect(() => {
    if (!teamAccounts) return;
    const requested = teamAccounts.filter((account) => account.status === "Requested");
    setRequestedAccounts(requested);

    const registration = teamAccounts.filter((account) => account.status === "Registration");
    setRegistrationAccounts(registration);
  }, [teamAccounts]);

  if ((!requestedAccounts || requestedAccounts?.length === 0) && (!registrationAccounts || registrationAccounts?.length === 0)) {
    return null;
  }

  return (
    <TableWrapper title="Requested Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={requestedAccountsPanelExpanded} setPanelExpanded={setRequestedAccountsPanelExpanded}>
      {requestedAccounts && requestedAccounts.length > 0 && requestedAccounts.map((account) => <RequestedRow key={account._id} account={account} />)}
      {registrationAccounts && registrationAccounts.length > 0 && registrationAccounts.map((account) => <RegistrationRow key={account._id} account={account} />)}
    </TableWrapper>
  );
};

export default RequestedTable;
