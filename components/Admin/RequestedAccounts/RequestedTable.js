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
  const { adminAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!adminAccounts) return;
    const requested = adminAccounts.filter((account) => account.status === "Requested");
    setRequestedAccounts(requested);

    const registration = adminAccounts.filter((account) => account.status === "Registration");
    setRegistrationAccounts(registration);
  }, [adminAccounts]);

  if ((!requestedAccounts || requestedAccounts?.length === 0) && (!registrationAccounts || registrationAccounts?.length === 0)) {
    return null;
  }
  console.log("Requested Table adminAccounts: ", adminAccounts);
  console.log("Requested Table requested Accounts: ", requestedAccounts);
  console.log("Requested Table registrationAccounts: ", registrationAccounts);
  return (
    <TableWrapper title="Requested Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={requestedAccountsPanelExpanded} setPanelExpanded={setRequestedAccountsPanelExpanded}>
      {requestedAccounts && requestedAccounts.length > 0 && requestedAccounts.map((account) => <RequestedRow key={account._id} account={account} />)}
      {registrationAccounts && registrationAccounts.length > 0 && registrationAccounts.map((account) => <RegistrationRow key={account._id} account={account} />)}
      {requestedAccounts && requestedAccounts.length === 0 && registrationAccounts && registrationAccounts.length === 0 && <div className="flex w-full justify-center items-center">There is no requested accounts at the moment</div>}
    </TableWrapper>
  );
};

export default RequestedTable;
