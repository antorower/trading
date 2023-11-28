"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      setUserData(user);
    }
  }, [user]);

  return <UserContext.Provider value={{ userData, selectedUser, setSelectedUser }}>{children}</UserContext.Provider>;
};
