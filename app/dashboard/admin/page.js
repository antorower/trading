"use client";
import React from "react";
import Title from "@/components/Title";
import RequestedTable from "@/components/Admin/RequestedAccounts/RequestedTable";

const Admin = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      <RequestedTable />
    </div>
  );
};

export default Admin;
