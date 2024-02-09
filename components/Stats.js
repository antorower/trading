import React from "react";
import { useUserContext } from "@/context/UserContext";

const Stats = () => {
  const { stats } = useUserContext();
  if (!stats) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      <div className="flex flex-col w-[500px] p-4">
        <div className="flex justify-center items-center"> Accounts: </div>
        <div className="flex justify-between">
          <div>5K Accounts:</div>
          <div>{stats.numberOfAccounts5K}</div>
        </div>
        <div className="flex justify-between">
          <div>10K Accounts:</div>
          <div>{stats.numberOfAccounts10K}</div>
        </div>
        <div className="flex justify-between">
          <div>25K Accounts:</div>
          <div>{stats.numberOfAccounts25K}</div>
        </div>
        <div className="flex justify-between">
          <div>50K Accounts:</div>
          <div>{stats.numberOfAccounts50K}</div>
        </div>
        <div className="flex justify-between">
          <div>100K Accounts:</div>
          <div>{stats.numberOfAccounts100K}</div>
        </div>
        <div className="flex justify-between">
          <div>200K Accounts:</div>
          <div>{stats.numberOfAccounts200K}</div>
        </div>
      </div>
      <div className="flex flex-col w-[500px] p-4">
        <div className="flex justify-between">
          <div>Phase 1 | One win upgrade:</div>
          <div>{stats.oneTradeUpgradePhase1}</div>
        </div>
        <div className="flex justify-between">
          <div>Phase 2 | One win upgrade:</div>
          <div>{stats.oneTradeUpgradePhase2}</div>
        </div>
        <div className="flex justify-between">
          <div>One win payment:</div>
          <div>{stats.oneTradePayment}</div>
        </div>
        <div className="flex justify-between">
          <div>Total one win target reached:</div>
          <div>{stats.oneTradeTarget}</div>
        </div>
        <div className="flex justify-between">
          <div>Lose with one trade:</div>
          <div>{stats.oneTradeLose}</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
