"use client";
import React from "react";
import Stats from "@/components/Stats";

const Dashboard = () => {
  return (
    <div className=" text-white p-4 w-full h-full">
      <div className="h-full flex justify-center items-center text-2xl">
        <Stats />
      </div>
    </div>
  );
};

export default Dashboard;
