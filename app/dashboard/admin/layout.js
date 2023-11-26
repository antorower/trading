"use client";
import React, { useState, useEffect } from "react";
import { AdminContextProvider } from "@/context/AdminContext";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import UserBar from "@/components/UserBar";

export default function AdminLayout({ children }) {
  const [users, setUsers] = useState([]);
  const [usersMenuExpanded, setUsersMenuExpanded] = useState(false);

  const errorNotification = (message) => toast.warn(message);
  const GetUsers = async () => {
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
    } catch (error) {
      errorNotification(error.message);
      await SaveError(error.message, "File: /dashboard/admin/layout | Function: layout", status);
    }
  };

  useEffect(() => {
    GetUsers();
  }, []);

  return (
    <AdminContextProvider>
      <div className="flex h-full relative">
        <div className="flex w-full h-full p-4">{children}</div>
        <UserBar users={users} />
      </div>
    </AdminContextProvider>
  );
}
/*

{users.map((user) => (
            <UserButton key={user.id} imageUrl={user.imageUrl} id={user.id} username={user.username} firstName={user.firstName} lastName={user.lastName} />
          ))}

          */
