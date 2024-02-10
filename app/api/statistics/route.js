import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";

export async function GET(req, context) {
  let numberOfAccounts5K = 0;
  let numberOfAccounts10K = 0;
  let numberOfAccounts25K = 0;
  let numberOfAccounts50K = 0;
  let numberOfAccounts100K = 0;
  let numberOfAccounts200K = 0;
  let numberOfAccounts300K = 0;

  let numberOfAccountsPhase1 = 0;
  let numberOfAccountsPhase2 = 0;
  let numberOfAccountsPhase3 = 0;

  let oneTradeUpgradePhase1 = 0;
  let oneTradeUpgradePhase2 = 0;
  let oneTradePayment = 0;
  let oneTradeTarget = 0;
  let oneTradeLose = 0;

  let totalFundedCapital = 0;

  await dbConnect();
  let accounts = await Account.find({
    status: { $in: ["Live", "Upgrade", "Payout", "Payment"] },
  });
  if (!accounts || !accounts.length) {
    return NextResponse.json({ error: message }, { status: 404 });
  } else {
    accounts.forEach((account) => {
      const capital = account.capital;

      // Αυτό το κάνω για να ξέρω πόσα accounts υπάρχουν από το κάθε κεφάλαιο
      if (capital === 5000) numberOfAccounts5K++;
      else if (capital === 10000) numberOfAccounts10K++;
      else if (capital === 25000) numberOfAccounts25K++;
      else if (capital === 50000) numberOfAccounts50K++;
      else if (capital === 100000) numberOfAccounts100K++;
      else if (capital === 200000) numberOfAccounts200K++;
      else if (capital === 300000) numberOfAccounts300K++;

      const remainingProfit = account.target - account.balance;
      const remainingProfitPercent = remainingProfit / capital;
      if (account.phase === 1 && remainingProfitPercent <= 0.044 && remainingProfit > 0) oneTradeUpgradePhase1++;
      if (account.phase === 2 && remainingProfitPercent <= 0.05 && remainingProfit > 0) oneTradeUpgradePhase2++;
      if (account.phase === 3 && remainingProfitPercent <= 0.04 && remainingProfit > 0) oneTradePayment++;
      if (account.overallDrawdown > account.balance - account.dailyDrawdown * 0.8) oneTradeLose++;

      if (account.phase === 1 && account.status === "Live") numberOfAccountsPhase1++;
      if ((account.phase === 2 && account.status === "Live") || (account.phase === 1 && account.status === "Upgrade")) numberOfAccountsPhase2++;
      if ((account.phase === 3 && (account.status === "Live" || account.status === "Payment" || account.status === "Payout")) || (account.phase === 2 && account.status === "Upgrade")) numberOfAccountsPhase3++;

      if (account.phase === 3) {
        totalFundedCapital = totalFundedCapital + account.capital;
      }
    });

    oneTradeTarget = oneTradeUpgradePhase1 + oneTradeUpgradePhase2 + oneTradePayment;
    // Prepare the response data with the counts
    const responseData = {
      numberOfAccounts5K,
      numberOfAccounts10K,
      numberOfAccounts25K,
      numberOfAccounts50K,
      numberOfAccounts100K,
      numberOfAccounts200K,
      oneTradeUpgradePhase1,
      oneTradeUpgradePhase2,
      oneTradePayment,
      oneTradeTarget,
      oneTradeLose,
      numberOfAccountsPhase1,
      numberOfAccountsPhase2,
      numberOfAccountsPhase3,
      totalFundedCapital,
    };

    // Return the counts instead of the raw accounts data
    return NextResponse.json(responseData);
  }
}
