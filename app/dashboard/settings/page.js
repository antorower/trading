"use client";
import React, { useState, useEffect } from "react";
import Title from "@/components/Title";
import WalletSettings from "@/components/Wallet/WalletSettings";
import TeamWalletSettings from "@/components/Wallet/TeamWalletSettings";

const Settings = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="User Setting" subtitle="Customize your experience" />
      <TeamWalletSettings />
      <WalletSettings />
    </div>
  );
};

export default Settings;
