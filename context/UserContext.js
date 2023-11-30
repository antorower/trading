"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { currentUser } from "@clerk/nextjs";

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [activeAccounts, setActiveAccounts] = useState([]);
  const { user } = useUser();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    if (user && user.id) {
      setUserData(user);
      UpdateActiveAccounts();
    }
  }, [user]);

  const UpdateActiveAccounts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-active-accounts`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      console.log("The data", data);
      setActiveAccounts(data);
    } catch (error) {
      console.log(error);
      errorNotification(error.message);
    }
  };

  return <UserContext.Provider value={{ userData, selectedUser, setSelectedUser, activeAccounts, UpdateActiveAccounts }}>{children}</UserContext.Provider>;
};
