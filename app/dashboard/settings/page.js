"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import Title from "@/components/Title";
import TableWrapper from "@/components/TableWrapper";
import TableRow from "@/components/TableRow";
import WalletSettings from "@/components/WalletSettings";
import TeamWalletSettings from "@/components/TeamWalletSettings";

const Settings = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="User Setting" subtitle="Customize your experience" />
      <WalletSettings />
      <TeamWalletSettings />
    </div>
  );
};

export default Settings;
