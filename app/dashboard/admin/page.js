"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useAdminContext } from "@/context/AdminContext";
import Image from "next/image";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";
import TableRow from "@/components/TableRow";

const Admin = () => {
  const { selectedUser } = useUserContext();
  const { users, UpdateUsers } = useAdminContext();
  const [newUsers, setNewUsers] = useState([]);
  const [newUsersPanelExpanded, setNewUsersPanelExpanded] = useState(true);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    setNewUsers(users.filter((user) => user.publicMetadata.registered && user.publicMetadata.active && !user.publicMetadata.banned));
  }, [users]);

  const NewUserResponse = async (event, accepted, userId) => {
    event.preventDefault();
    const successNotification = (message) => toast.success(message);
    const errorNotification = (message) => toast.warn(message);
    let status = 0;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/user/${accepted ? "activate-user" : "ban-user"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });
      if (!response.ok) {
        status = response.status;
        if (response.status === 500) {
          throw new Error("Server error. User does not updated.");
        }
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification(`User ${accepted ? "accepted" : "rejected"} successfully`);
      await UpdateUsers();
    } catch (error) {
      errorNotification(error.message);
      await SaveError(error.message, "File: file | Function: function", status);
    }
  };

  const RefreshUsers = async () => {
    const response = await UpdateUsers();
    if (response) {
      successNotification("Users successfully updated.");
    }
    if (!response) {
      errorNotification("Failed to update users. Please try again.");
    }
  };

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      {newUsers.length > 0 && (
        <TableWrapper title="New Users" refresh={true} refreshFunction={RefreshUsers}>
          {newUsersPanelExpanded &&
            newUsers.map((user) => (
              <TableRow>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-[50px] h-[50px] text-lg font-weight-700 flex items-center relative">
                    <Image src={user.imageUrl} fill="true" className="rounded-full" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="font-weight-700">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-gray-500">{user.username}</div>
                  </div>
                </div>
                <div className="flex gap-6 justify-end">
                  <button
                    onClick={(e) => NewUserResponse(e, true, user.id)}
                    className="px-8 bg-green-700 rounded hover:bg-green-800 transition-all duration-500 font-weight-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => NewUserResponse(e, false, user.id)}
                    className="px-6 p-2 bg-red-700 rounded hover:bg-red-800 transition-all duration-500 font-weight-500"
                  >
                    Decline
                  </button>
                </div>
              </TableRow>
            ))}
        </TableWrapper>
      )}
    </div>
  );
};

export default Admin;
