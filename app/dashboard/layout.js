"use client";
import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-full">
      <SideBar />
      <div className="flex-1 flex flex-col h-full">
        <TopBar />
        <div className="flex-1 overflow-auto scrollable">{children}</div>
      </div>
    </div>
  );
}
