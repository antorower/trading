"use client";
import React, { useState, useEffect } from "react";
import UserBar from "@/components/UserBar/UserBar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-full">
      <div className="h-full flex-1">{children}</div>
      <div className="h-full">
        <UserBar />
      </div>
    </div>
  );
}

/*

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
      await SaveError(error.message, "File: /dashboard/admin/layout | Function: GetUsers", status);
    }
  };

  */
