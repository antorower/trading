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
  const [teamUsers, setTeamUsers] = useState(null);

  const [userAccounts, setUserAccounts] = useState(null);
  const [teamAccounts, setTeamAccounts] = useState(null);
  const [adminAccounts, setAdminAccounts] = useState(null);

  const [settings, setSettings] = useState(null);
  const { user } = useUser();

  const [expandedLeftSidebar, setExpandedLeftSidebar] = useState(false);
  const [expandedRightSidebar, setExpandedRightSidebar] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const [stats, setStats] = useState(null);

  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    const LoadData = async () => {
      if (user && user.id) {
        await UpdateAccounts();
        await UpdateUsers();
        await UpdateSettings();
        console.log("START");
        await GetStats();
        console.log("END");
        setUserData(user);
      }
    };
    LoadData();
  }, [user]);

  useEffect(() => {
    if (!settings) return;
    const GetPayouts = async () => {
      // Εδω θα παρω τα payouts ολα των τελευταιων δυο μηνων
    };
  }, [settings]);

  const UpdateAccounts = async (selectedUser) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-accounts`);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      console.log("Context Update Accounts", data);
      if (!selectedUser) {
        await UpdateUsers();
        setUserAccounts(data.userAccounts);
        setTeamAccounts(data.teamAccounts);
        setAdminAccounts(data.adminAccounts);
        console.log("here context");
      } else {
        const selectedAccounts = data.adminAccounts.filter((account) => account.userId === selectedUser.id);
        setAdminAccounts(selectedAccounts);
        setTeamAccounts(selectedAccounts);
        setUsers([selectedUser]);
        console.log("there context");
      }
    } catch (error) {
      console.log(error.message);
      errorNotification(error.message);
    }
  };

  const GetStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics`);
      console.log("REQUEST MADE");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      console.log("OK STATS");
      setStats(data);
    } catch (error) {
      console.log(error.message);
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
      const teamUsersArray = data.filter((currentUser) => {
        return user.id === currentUser.publicMetadata.mentor;
      });
      setTeamUsers(teamUsersArray);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        users,
        userAccounts,
        teamAccounts,
        teamUsers,
        adminAccounts,
        expandedLeftSidebar,
        expandedRightSidebar,
        activeMenu,
        settings,
        stats,
        UpdateUsers,
        UpdateAccounts,
        UpdateSettings,
        setActiveMenu,
        setExpandedLeftSidebar,
        setExpandedRightSidebar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
