"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import TableWrapper from "../../TableWrapper";
import PayrollRow from "./PayrollRow";

const PayrollTable = () => {
  const [payrollAccountsPanelExpanded, setPayrollAccountsPanelExpanded] = useState(false);
  const { users, UpdateUsers } = useUserContext();
  const [payrollUsers, setPayrollUsers] = useState([]);
  const [nonPayrollUsers, setNonPayrollUsers] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      let payrollUsersArray = users.filter((user) => user.publicMetadata.payroll === true);
      let nonPayrollUsersArray = users.filter((user) => user.publicMetadata.payroll === false);
      setPayrollUsers(payrollUsersArray);
      setNonPayrollUsers(nonPayrollUsersArray);
    }
  }, [users]);

  if (!users) {
    return null;
  }

  return (
    <TableWrapper title="Payroll Users" refresh={true} refreshFunction={UpdateUsers} panelExpanded={payrollAccountsPanelExpanded} setPanelExpanded={setPayrollAccountsPanelExpanded}>
      <div>Active: {payrollUsers.length}</div>
      {payrollUsers && payrollUsers.length > 0 && payrollUsers.map((user) => <PayrollRow key={user.id} user={user} />)}
      <div>Inactive: {nonPayrollUsers.length}</div>
      {nonPayrollUsers && nonPayrollUsers.length > 0 && nonPayrollUsers.map((user) => <PayrollRow key={user.id} user={user} />)}
    </TableWrapper>
  );
};

export default PayrollTable;
