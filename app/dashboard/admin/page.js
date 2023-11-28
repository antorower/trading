"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useAdminContext } from "@/context/AdminContext";
import Image from "next/image";
import { toast } from "react-toastify";

const Admin = () => {
  const { selectedUser } = useUserContext();
  const { users, UpdateUsers } = useAdminContext();
  const [newUsers, setNewUsers] = useState([]);
  const [newUsersPanelExpanded, setNewUsersPanelExpanded] = useState(true);

  useEffect(() => {
    console.log("Users: ", users);
    setNewUsers(users.filter((user) => user.publicMetadata.registered && !user.publicMetadata.active && !user.publicMetadata.banned));
    console.log("Second user", users);
    console.log(newUsers);
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

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="font-roboto font-weight-500 text-2xl">Admin Dashboard</div>
          <div className="font-roboto text-sm text-gray-500">Team management</div>
        </div>
        <div className="text-lg font-weight-600">{new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}</div>
      </div>
      {newUsers.length > 0 && (
        <div className="flex flex-col bg-light rounded-xl p-8 gap-4">
          <div className="flex justify-between items-center border-b border-gray-800 p-2">
            <div className="font-roboto font-weight-500 text-lg">New Users</div>
            <div className="flex gap-4">
              <button onClick={() => setNewUsersPanelExpanded(!newUsersPanelExpanded)} className="w-[14px] h-[14px] relative">
                <Image src={`/${newUsersPanelExpanded ? "minus" : "plus"}.svg`} fill="true" />
              </button>
              <button onClick={UpdateUsers} className="w-[14px] h-[14px] relative">
                <Image src="/refresh.svg" fill="true" />
              </button>
            </div>
          </div>

          {newUsersPanelExpanded &&
            newUsers.map((user) => (
              <div key={user.id} className="p-6 flex flex-wrap gap-4 justify-between bg-theme1 rounded-xl">
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
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
