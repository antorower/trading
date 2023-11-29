"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export const AdminContext = createContext();

export const useAdminContext = () => {
  return useContext(AdminContext);
};

export const AdminContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

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
      return false;
    }
  };

  useEffect(() => {
    UpdateUsers();
  }, []);

  return <AdminContext.Provider value={{ selectedUser, setSelectedUser, users, setUsers, UpdateUsers }}>{children}</AdminContext.Provider>;
};
