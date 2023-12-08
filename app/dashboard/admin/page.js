"use client";
import React from "react";
import Title from "@/components/Title";
import RequestedTable from "@/components/Admin/RequestedAccounts/RequestedTable";
import LostTable from "@/components/Admin/Lost/LostTable";
import NewUsersTable from "@/components/Admin/NewUsers/NewUsersTable";
import Schedule from "@/components/Admin/Schedule/Schedule";
import LiveTable from "@/components/Admin/Live/LiveTable";

const Admin = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      <NewUsersTable />
      <RequestedTable />
      <LiveTable />
      <LostTable />
      <Schedule />
    </div>
  );
};

export default Admin;
