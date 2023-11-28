"use client";
import React from "react";
import { useUserContext } from "@/context/UserContext";

const Admin = () => {
  const { selectedUser } = useUserContext();
  return (
    <div className="text-white h-full flex flex-wrap overflow-auto scrollable p-4 justify-center">
      <div>{selectedUser}</div>
    </div>
  );
};

export default Admin;
