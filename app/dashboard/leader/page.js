"use client";
import React from "react";
import Title from "@/components/Title";
import RequestedTable from "@/components/Leader/RequestedAccounts/RequestedTable";
import LiveTable from "@/components/Leader/Live/LiveTable";
import PayoutTable from "@/components/Leader/Payout/PayoutTable";
import UpgradeTable from "@/components/Leader/Upgrade/UpgradeTable";

const Leader = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Leader Dashboard" subtitle="Team Management" />
      <PayoutTable />
      <RequestedTable />
      <UpgradeTable />
      <LiveTable />
    </div>
  );
};

export default Leader;
