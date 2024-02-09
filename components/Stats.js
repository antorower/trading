import React from "react";
import { useUserContext } from "@/context/UserContext";

const ProgressBar = ({ value, max, label }) => {
  const width = Math.max(5, (value / max) * 100); // Ensure minimal width for visibility
  return (
    <div className="w-full bg-gray-700 rounded-full h-8 mb-4 text-xs">
      <div style={{ width: `${width}%` }} className="bg-green-500 h-8 rounded-full flex items-center transition-all duration-300 ease-in-out">
        <span className="w-full text-center text-sm font-semibold text-white">{`${label}: ${value}`}</span>
      </div>
    </div>
  );
};

const StatsCard = ({ title, children }) => (
  <div className="bg-gray-800 bg-opacity-75 rounded-lg p-6 shadow-xl">
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const Stats = () => {
  const { stats } = useUserContext();

  if (!stats) {
    return <div>Loading...</div>;
  }

  // Find the max value for progress bars, assuming you have a max trade value for the calculation
  const maxTradeValue = Math.max(stats.oneTradeUpgradePhase1, stats.oneTradeUpgradePhase2, stats.oneTradePayment, stats.oneTradeTarget, stats.oneTradeLose);

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
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
