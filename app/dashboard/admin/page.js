"use client";
import React, { useState, useEffect } from "react";
import Title from "@/components/Title";
import NewUsersTable from "@/components/Admin/NewUsersTable";
import RequestedAccountsTable from "@/components/Admin/RequestedAccounts";
import Schedule from "@/components/Admin/Schedule";
import UserTable from "@/components/Admin/UserTable";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const Admin = () => {
  const { selectedUser } = useUserContext();
  const [user, setUser] = useState(null);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const GetUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/user/get-user/${selectedUser}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUser(data);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    GetUser();
  }, [selectedUser]);

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      <Schedule />
      <UserTable user={user} />
      <NewUsersTable />
      <RequestedAccountsTable />
    </div>
  );
};

export default Admin;
