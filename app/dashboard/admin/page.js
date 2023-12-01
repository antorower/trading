"use client";
import React from "react";
import Title from "@/components/Title";
import NewUsersTable from "@/components/Admin/NewUsersTable";
import RequestedAccountsTable from "@/components/Admin/RequestedAccounts";

const Admin = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      <NewUsersTable />
      <RequestedAccountsTable />
    </div>
  );
};

export default Admin;
