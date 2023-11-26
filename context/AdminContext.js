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

  return <AdminContext.Provider value={{ selectedUser, setSelectedUser }}>{children}</AdminContext.Provider>;
};
