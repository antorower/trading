"use client";
import React, { useState, useEffect } from "react";
import Title from "@/components/Title";
import WalletSettings from "@/components/Wallet/WalletSettings";
import TeamWalletSettings from "@/components/Wallet/TeamWalletSettings";
import CopyLink from "@/components/CopyLink";
import { useUser } from "@clerk/nextjs";

const Settings = () => {
  const { user } = useUser();
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    if (!user) return;
    setReferralLink(process.env.NEXT_PUBLIC_URL + "/sign-up?id=" + user.id);
  }, [user]);

  if (!user) return null;

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="User Setting" subtitle="Customize your experience" />
      {(user.publicMetadata.role === "admin" || user.publicMetadata.role === "leader") && <CopyLink link={referralLink} />}
      {/*<TeamWalletSettings />*/}
      {/*<WalletSettings />*/}
    </div>
  );
};

export default Settings;
