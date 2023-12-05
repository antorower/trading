"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [userAccounts, setUserAccounts] = useState(null);
  const [teamAccounts, setTeamAccounts] = useState(null);
  const [adminAccounts, setAdminAccounts] = useState(null);
  const [settings, setSettings] = useState(null);
  const { user } = useUser();

  const [expandedLeftSidebar, setExpandedLeftSidebar] = useState(false);
  const [expandedRightSidebar, setExpandedRightSidebar] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    if (user && user.id) {
      UpdateAccounts();
      UpdateUsers();
      UpdateSettings();
      setUserData(user);
    }
  }, [user]);

  const UpdateAccounts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-accounts`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUserAccounts(data.userAccounts);
      setTeamAccounts(data.teamAccounts);
      setAdminAccounts(data.adminAccounts);

      console.log("User Accounts: ", userAccounts);
      console.log("Team Accounts: ", teamAccounts);
      console.log("Admin Accounts: ", adminAccounts);
    } catch (error) {
      console.log(error);
      errorNotification(error.message);
    }
  };

  const UpdateSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-settings`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setSettings(data);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const UpdateUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-users`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUsers(data);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        users,
        selectedUser,
        userAccounts,
        teamAccounts,
        adminAccounts,
        expandedLeftSidebar,
        expandedRightSidebar,
        activeMenu,
        settings,
        UpdateUsers,
        UpdateAccounts,
        UpdateSettings,
        setSelectedUser,
        setActiveMenu,
        setExpandedLeftSidebar,
        setExpandedRightSidebar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
