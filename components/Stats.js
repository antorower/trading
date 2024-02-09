import React from "react";
import { useUserContext } from "@/context/UserContext";

const ProgressBar = ({ value, max, label }) => (
  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${(value / max) * 100}%` }}>{`${label}: ${value}`}</div>
  </div>
);

const Stats = () => {
  const { stats } = useUserContext();
  console.log("Stats: ", stats);

  if (!stats) return null;

  // Assume max value for progress bars, adjust based on your data needs
  const maxTradeValue = Math.max(stats.oneTradeUpgradePhase1, stats.oneTradeUpgradePhase2, stats.oneTradePayment, stats.oneTradeTarget, stats.oneTradeLose);

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {/* Account Balance Stats */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 w-full md:w-auto">
        <h2 className="text-xl font-semibold text-gray-700">Account Balances</h2>
        <p>5K Accounts: {stats.numberOfAccounts5K}</p>
        <p>10K Accounts: {stats.numberOfAccounts10K}</p>
        <p>25K Accounts: {stats.numberOfAccounts25K}</p>
        <p>50K Accounts: {stats.numberOfAccounts50K}</p>
        <p>100K Accounts: {stats.numberOfAccounts100K}</p>
        <p>200K Accounts: {stats.numberOfAccounts200K}</p>
      </div>

      {/* Trade Stats */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 w-full md:w-auto">
        <h2 className="text-xl font-semibold text-gray-700">Trade Performance</h2>
        <ProgressBar value={stats.oneTradeUpgradePhase1} max={maxTradeValue} label="Upgrade Phase 1" />
        <ProgressBar value={stats.oneTradeUpgradePhase2} max={maxTradeValue} label="Upgrade Phase 2" />
        <ProgressBar value={stats.oneTradePayment} max={maxTradeValue} label="Payment" />
        <ProgressBar value={stats.oneTradeTarget} max={maxTradeValue} label="Target Achieved" />
        <ProgressBar value={stats.oneTradeLose} max={maxTradeValue} label="Losses" />
      </div>
    </div>
  );
};

export default Stats;
