"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const InterfaceContext = createContext();

export const useInterfaceContext = () => {
  return useContext(InterfaceContext);
};

export const InterfaceContextProvider = ({ children }) => {
  const [expandedLeftSidebar, setExpandedLeftSidebar] = useState(false);
  const [expandedRightSidebar, setExpandedRightSidebar] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  return (
    <InterfaceContext.Provider
      value={{ expandedLeftSidebar, setExpandedLeftSidebar, activeMenu, setActiveMenu, expandedRightSidebar, setExpandedRightSidebar }}
    >
      {children}
    </InterfaceContext.Provider>
  );
};
