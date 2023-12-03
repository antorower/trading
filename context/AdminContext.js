"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = ({ children }) => {
  const [activeAccounts, setActiveAccounts] = useState(null);
  const [users, setUsers] = useState(null);
  const [settings, setSettings] = useState(null);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

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

      if (data && data.length > 0) {
        const accountsWithUser = data.map((account) => {
          const user = users.find((user) => user.username === account.username);
          return { ...account, user };
        });
        setActiveAccounts(accountsWithUser);
      }

      return true;
    } catch (error) {
      console.log(error);
      errorNotification(error.message);
      return null;
    }
  };

  const UpdateSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/get-settings`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setSettings(data);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  useEffect(() => {
    const InitializeData = async () => {
      await UpdateUsers();
    };

    InitializeData();
    UpdateSettings();
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      UpdateActiveAccounts();
    }
  }, [users]);

  return <AdminContext.Provider value={{ users, setUsers, UpdateUsers, activeAccounts, UpdateActiveAccounts, settings, UpdateSettings }}>{children}</AdminContext.Provider>;
};
