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
