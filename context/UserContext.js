"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      setUserData(user);
    }
  }, [user]);

  const ToggleMenu = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  return <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>;
};
