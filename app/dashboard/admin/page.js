"use client";
import React from "react";
import Title from "@/components/Title";
import RequestedTable from "@/components/Admin/RequestedAccounts/RequestedTable";
import LostTable from "@/components/Admin/Lost/LostTable";
import NewUsersTable from "@/components/Admin/NewUsers/NewUsersTable";
import Schedule from "@/components/Admin/Schedule/Schedule";
import LiveTable from "@/components/Admin/Live/LiveTable";
import PayoutTable from "@/components/Admin/Payout/PayoutTable";
import UpgradeTable from "@/components/Admin/Upgrade/UpgradeTable";
import PayrollTable from "@/components/Admin/Payroll/PayrollTable";

const Admin = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      <NewUsersTable />
      <PayoutTable />
      <RequestedTable />
      <UpgradeTable />
      <LiveTable />
      <LostTable />
      <Schedule />
      <PayrollTable />
    </div>
  );
};

export default Admin;
