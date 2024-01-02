"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import RequestedRow from "./RequestedRow";
import RegistrationRow from "./RegistrationRow";
import RejectedRow from "./RejectedRow";
import RequestNewAccountBar from "./RequestNewAccountBar";

const RequestedTable = () => {
  const [requestedAccountsPanelExpanded, setRequestedAccountsPanelExpanded] = useState(true);
  const [registrationAccounts, setRegistrationAccounts] = useState(null);
  const [requestedAccounts, setRequestedAccounts] = useState(null);
  const [rejectedAccounts, setRejectedAccounts] = useState(null);
  const { userAccounts, UpdateAccounts } = useUserContext();

  useEffect(() => {
    if (!userAccounts) return;
    const requested = userAccounts.filter((account) => account.status === "Requested");
    setRequestedAccounts(requested);

    const registration = userAccounts.filter((account) => account.status === "Registration");
    setRegistrationAccounts(registration);

    const rejected = userAccounts.filter((account) => account.status === "Rejected");
    setRejectedAccounts(rejected);
  }, [userAccounts]);

  let element;
  if ((!requestedAccounts || requestedAccounts.length === 0) && (!registrationAccounts || registrationAccounts.length === 0) && (!rejectedAccounts || rejectedAccounts.length === 0)) {
    element = <div className="flex text-center justify-center"> There is no requested accounts at the moment </div>;
  } else {
    element = null;
  }

  return (
    <TableWrapper title="Requested Accounts" refresh={true} refreshFunction={UpdateAccounts} panelExpanded={requestedAccountsPanelExpanded} setPanelExpanded={setRequestedAccountsPanelExpanded}>
      <RequestNewAccountBar />
      {registrationAccounts && registrationAccounts.length > 0 && registrationAccounts.map((account) => <RegistrationRow key={account._id} account={account} />)}
      {requestedAccounts && requestedAccounts.length > 0 && requestedAccounts.map((account) => <RequestedRow key={account._id} account={account} />)}
      {rejectedAccounts && rejectedAccounts.length > 0 && rejectedAccounts.map((account) => <RejectedRow key={account._id} account={account} />)}
      {element}
    </TableWrapper>
  );
};

export default RequestedTable;
