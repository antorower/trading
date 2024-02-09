import React from "react";
import { useUserContext } from "@/context/UserContext";

const ProgressBar = ({ value, max, label }) => (
  <div className="w-full bg-gray-700 rounded-full overflow-hidden h-6 mb-4 text-xs flex bg-opacity-20">
    <div style={{ width: `${(value / max) * 100}%` }} className={`flex justify-center items-center ${value > 0 ? "bg-green-400" : "bg-gray-600"} text-gray-800 text-sm h-6 font-bold`}>
      {value > 0 ? `${label}: ${value}` : ""}
    </div>
  </div>
);

const StatsCard = ({ title, children }) => (
  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 md:p-6 xl:p-8 shadow-xl">
    <h3 className="text-lg md:text-xl xl:text-2xl font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const Stats = () => {
  const { stats } = useUserContext();

  if (!stats) return null;

  // Assume max value for progress bars, adjust based on your data needs
  const maxTradeValue = Math.max(stats.oneTradeUpgradePhase1, stats.oneTradeUpgradePhase2, stats.oneTradePayment, stats.oneTradeTarget, stats.oneTradeLose);

  return (
    <div className="flex flex-wrap gap-4 justify-center p-4 text-white">
      {/* Account Balance Stats */}
      <StatsCard title="Account Balances">
        <p>5K Accounts: {stats.numberOfAccounts5K}</p>
        <p>10K Accounts: {stats.numberOfAccounts10K}</p>
        <p>25K Accounts: {stats.numberOfAccounts25K}</p>
        <p>50K Accounts: {stats.numberOfAccounts50K}</p>
        <p>100K Accounts: {stats.numberOfAccounts100K}</p>
        <p>200K Accounts: {stats.numberOfAccounts200K}</p>
      </StatsCard>

      {/* Trade Stats */}
      <StatsCard title="Trade Performance">
        <ProgressBar value={stats.oneTradeUpgradePhase1} max={maxTradeValue} label="Upgrade Phase 1" />
        <ProgressBar value={stats.oneTradeUpgradePhase2} max={maxTradeValue} label="Upgrade Phase 2" />
        <ProgressBar value={stats.oneTradePayment} max={maxTradeValue} label="Payment" />
        <ProgressBar value={stats.oneTradeTarget} max={maxTradeValue} label="Target Achieved" />
        <ProgressBar value={stats.oneTradeLose} max={maxTradeValue} label="Losses" />
      </StatsCard>
    </div>
  );
};

export default Stats;
