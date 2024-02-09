"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Stats from "@/components/Stats";

const Dashboard = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }

  return (
    <div className=" text-white p-4 w-full h-full">
      <div className="h-full flex justify-center items-center text-2xl">Welcome back, {user?.username}</div>
      <Stats />
    </div>
  );
};

export default Dashboard;
