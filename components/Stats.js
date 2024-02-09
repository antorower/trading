import React from "react";
import { useUserContext } from "@/context/UserContext";

const StatsItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-md font-medium text-gray-300">{label}</span>
    <span className="text-lg font-bold text-white">{value}</span>
  </div>
);

const StatsCard = ({ title, stats }) => (
  <div className="bg-gray-800 bg-opacity-75 rounded-lg p-6 shadow-xl w-full md:w-1/2 lg:w-1/3">
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    {Object.keys(stats).map((key) => (
      <StatsItem key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} value={stats[key]} />
    ))}
  </div>
);

const Stats = () => {
  const { stats } = useUserContext();
  if (!stats) {
    return <div>Loading</div>;
  }

  // Split stats into two categories for display
  const balanceStats = {
    "5K Accounts": stats.numberOfAccounts5K,
    "10K Accounts": stats.numberOfAccounts10K,
    "25K Accounts": stats.numberOfAccounts25K,
    "50K Accounts": stats.numberOfAccounts50K,
    "100K Accounts": stats.numberOfAccounts100K,
    "200K Accounts": stats.numberOfAccounts200K,
  };

  const tradeStats = {
    "Upgrade Phase 1": stats.oneTradeUpgradePhase1,
    "Upgrade Phase 2": stats.oneTradeUpgradePhase2,
    Payment: stats.oneTradePayment,
    "Target Achieved": stats.oneTradeTarget,
    Losses: stats.oneTradeLose,
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      <StatsCard title="Account Balances" stats={balanceStats} />
      <StatsCard title="Trade Performance" stats={tradeStats} />
    </div>
  );
};

export default Stats;
