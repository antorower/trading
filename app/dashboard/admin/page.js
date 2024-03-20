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
import Stats from "@/components/Stats";
import { useUser } from "@clerk/nextjs";

const Admin = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      {user?.publicMetadata.permissions === "full" && <NewUsersTable />}
      <PayoutTable />
      <RequestedTable />
      <UpgradeTable />
      <LiveTable />
      <LostTable />
      {user?.publicMetadata.permissions === "full" && <Schedule />}
      {user?.publicMetadata.permissions === "full" && <PayrollTable />}
      <div>Test Div</div>
    </div>
  );
};

export default Admin;
