"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useAdminContext } from "@/context/AdminContext";
import Image from "next/image";
import { toast } from "react-toastify";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";
import TableRow from "@/components/TableRow";
import NewUsersTable from "@/components/Admin/NewUsersTable";

const Admin = () => {
  const { selectedUser } = useUserContext();
  const { users, UpdateUsers, activeAccounts, UpdateActiveAccounts } = useAdminContext();

  const [newUsers, setNewUsers] = useState(null);
  const [newUsersPanelExpanded, setNewUsersPanelExpanded] = useState(true);

  const [requestedAccounts, setRequestedAccounts] = useState(null);
  const [requestedAccountsPanelExpanded, setRequestedAccountsPanelExpanded] = useState(true);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    if (!users) return;
    setNewUsers(users.filter((user) => user.publicMetadata.registered && user.publicMetadata.active && !user.publicMetadata.banned));
  }, [users]);

  useEffect(() => {
    if (!activeAccounts) return;
    setRequestedAccounts(activeAccounts.filter((account) => account.status === "Requested" || account.status === "Registration"));
  }, [activeAccounts]);

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

  const GetUser = (username) => {
    return users.find((user) => user.username === username);
  };

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Admin Dashboard" subtitle="Team Management" />
      <NewUsersTable users={users}/>
      {newUsers && newUsers.length > 0 && (
        <TableWrapper
          title="New Users"
          refresh={true}
          refreshFunction={RefreshUsers}
          panelExpanded={newUsersPanelExpanded}
          setPanelExpanded={setNewUsersPanelExpanded}
        >
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
      )}

      {requestedAccounts && requestedAccounts.length > 0 && users && (
        <TableWrapper
          title="Requested Accounts"
          refresh={true}
          refreshFunction={UpdateActiveAccounts}
          panelExpanded={requestedAccountsPanelExpanded}
          setPanelExpanded={setRequestedAccountsPanelExpanded}
        >
          <div className="flex flex-col gap-4 overflow-y-auto scrollable max-h-[400px]">
            {requestedAccountsPanelExpanded &&
              requestedAccounts.map((account) => (
                <TableRow>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-4 items-center">
                      <div className="w-[50px] h-[50px] text-lg font-weight-700 flex items-center relative">
                        <Image src={GetUser(account.username).imageUrl} fill="true" className="rounded-full" />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="text-lg font-weight-700">{account.username}</div>
                        <div className="text-sm text-gray-500">
                          {account.lastName} {account.firstName}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-center">
                      <div className="text-gray-500 text-sm">{account.status === "Requested" ? "Requested Date" : "Money Transfered Date"}</div>
                      <div className="font-weight-700">
                        {new Date(account.createdDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>

                   {account.status === "Requested" && 
                    <form className="flex items-center space-x-4">
                      <select className="bg-gray-700 text-white rounded-lg p-2">
                        <option value="">Funding Pips</option>
                        <option value="">Fundex Next</option>
                        <option value="">FTMO</option>
                        <option value="">The Funded Trader</option>
                        <option value="">True Forex Funds</option>
                        <option value="">My Forex Funds</option>
                      </select>

                      <input 
                        type="number" 
                        step="1000" 
                        className="bg-gray-700 text-white rounded-lg p-2" 
                        placeholder="Capital" 
                      />

                      <input 
                        type="text" 
                        className="bg-gray-700 text-white rounded-lg p-2" 
                        placeholder="Wallet" 
                      />

                      <input 
                        type="number" 
                        className="bg-gray-700 text-white rounded-lg p-2" 
                        placeholder="Cost" 
                      />

                      <button type="submit" className="btn-primary">
                        Transfer Money
                      </button>
                    </form>}
    

                    <div className="flex gap-8 justify-between items-center">                      
                      <div className={`relative w-[22px] h-[22px] ${account.status === "Requested" && "animate-spin"}`}>
                        <Image src={`/${account.status === "Requested" ? "spinner" : "tick"}.svg`} fill="true" alt="spinner" />
                      </div>
                    </div>
                  </div>
                </TableRow>
              ))}
          </div>
        </TableWrapper>
      )}
    </div>
  );
};

export default Admin;
