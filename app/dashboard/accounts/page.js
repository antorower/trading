"use client";
import React from "react";
import Title from "@/components/Title";
import RequestedTable from "@/components/Accounts/Requested/RequestedTable";
import LostTable from "@/components/Accounts/Lost/LostTable";
import LiveTable from "@/components/Accounts/Live/LiveTable";
import UpgradeTable from "@/components/Accounts/Upgrade/UpgradeTable";

const Accounts = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Account Control Center" subtitle="Manage your accounts" />
      <LostTable />
      <UpgradeTable />
      <LiveTable />
      <RequestedTable />
    </div>
  );
};

export default Accounts;
