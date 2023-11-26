"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const InterfaceContext = createContext();

export const useInterfaceContext = () => {
  return useContext(InterfaceContext);
};

export const InterfaceContextProvider = ({ children }) => {
  const [expandedSidebar, setExpandedSidebar] = useState(true);
  const [activeMenu, setActiveMenu] = useState("");

  const ToggleMenu = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  return (
    <InterfaceContext.Provider value={{ expandedSidebar, setExpandedSidebar, ToggleMenu, activeMenu, setActiveMenu }}>{children}</InterfaceContext.Provider>
  );
};
