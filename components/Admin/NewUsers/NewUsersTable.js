"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";

const NewUsersTable = () => {
  const { users, UpdateUsers } = useUserContext();
  const [newUsers, setNewUsers] = useState(null);
  const [newUsersPanelExpanded, setNewUsersPanelExpanded] = useState(true);
  console.log("New Users", newUsers);
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const NewUserResponse = async (event, accepted, userId) => {
    event.preventDefault();
    const successNotification = (message) => toast.success(message);
    const errorNotification = (message) => toast.warn(message);
    let status = 0;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${accepted ? "activate-user" : "ban-user"}`, {
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
    }
  };

  useEffect(() => {
    if (!users) return;
    setNewUsers(users.filter((user) => user.publicMetadata.registered && !user.publicMetadata.active && !user.publicMetadata.banned));
  }, [users]);

  if (!newUsers || newUsers.length === 0) return null;

  return (
    <TableWrapper title="New Users" refresh={true} refreshFunction={UpdateUsers} panelExpanded={newUsersPanelExpanded} setPanelExpanded={setNewUsersPanelExpanded}>
      {newUsersPanelExpanded &&
        newUsers.map((user) => (
          <TableRow key={user.id}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-[50px] h-[50px] text-lg font-weight-700 flex items-center relative">
                <Image src={user.imageUrl} fill="true" sizes="32x32" className="rounded-full" alt="user" />
              </div>
              <div className="flex flex-col justify-between">
                <div className="font-weight-700">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-gray-500">{user.username}</div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center">
              <div className="font-weight-700">Mentor</div>
              <div className="text-gray-500">{user.publicMetadata.mentor}</div>
            </div>

            <div className="flex gap-6 justify-end">
              <button onClick={(e) => NewUserResponse(e, true, user.id)} className="btn-accept">
                Accept
              </button>
              <button onClick={(e) => NewUserResponse(e, false, user.id)} className="btn-decline">
                Decline
              </button>
            </div>
          </TableRow>
        ))}
    </TableWrapper>
  );
};

export default NewUsersTable;
