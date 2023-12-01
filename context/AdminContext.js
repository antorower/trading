"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = ({ children }) => {
  const [activeAccounts, setActiveAccounts] = useState(null);
  const [users, setUsers] = useState(null);

  const UpdateUsers = async () => {
    let status = 0;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/get-users`);
      if (!response.ok) {
        status = response.status;
        if (response.status === 500) {
          throw new Error("An internal error occured while getting all users");
        }
        const data = await response.json();
        throw new Error(data.error);
      }
      const data = await response.json();
      setUsers(data.users);
      return true;
    } catch (error) {
      errorNotification(error.message);
      await SaveError(error.message, "File: /AdminContext | Function: GetUsers", status);
      return null;
    }
  };

  const UpdateActiveAccounts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/accounts/get-active-accounts`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setActiveAccounts(data);
      return true;
    } catch (error) {
      console.log(error);
      errorNotification(error.message);
      return null;
    }
  };

  useEffect(() => {
    UpdateUsers();
    UpdateActiveAccounts();
  }, []);

  return <AdminContext.Provider value={{ users, setUsers, UpdateUsers, activeAccounts, UpdateActiveAccounts }}>{children}</AdminContext.Provider>;
};
