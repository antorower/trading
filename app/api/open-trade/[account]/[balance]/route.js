import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";

import Account from "@/models/Account";
import Settings from "@/models/Settings";
import Trade from "@/models/Trade";

export async function GET(req, context) {
  try {
    // Αρχή και τέλος της ημέρας για queries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Ορισμός σημερινής ημέρας
    function SetCurrentDay() {
      const today = new Date();
      const dayOfWeek = today.getDay();
      switch (dayOfWeek) {
        case 0:
          return "sunday";
        case 1:
          return "monday";
        case 2:
          return "tuesday";
        case 3:
          return "wednesday";
        case 4:
          return "thursday";
        case 5:
          return "friday";
        case 6:
          return "saturday";
        default:
          return "sunday";
      }
    }
    const day = SetCurrentDay();
    if (day === "sunday" || day === "saturday") {
      return NextResponse.json({ error: "Trades are not allowed today" });
    }

    await dbConnect();

    const account = context.params.account;
    const balance = Number(context.params.balance);

    // Αν το account ή το balance δεν υπάρχουν επιστρέφω error
    if (!account || isNaN(balance)) {
      return NextResponse.json({ error: "YES", message: "Inputs are wrong" }, { status: 400 });
    }

    // Τραβάω τα settings. Αν δεν βρεθούν επιστρέφω error.
    const settingsObj = await Settings.findOne();
    if (!settingsObj) {
      return NextResponse.json({ error: "YES", message: "Settings not found" }, { status: 404 });
    }

    // Αν σήμερα δεν είναι active η μέρα επιστρέφω error
    if (!settingsObj.schedule[day].activeDay) {
      return NextResponse.json({ error: "YES", message: "Today is not active day" }, { status: 400 });
    }

    // Τραβάω το account. Αν δεν βρεθεί account επιστρέφει error.
    let accountObj = await Account.findOne({ number: account });
    if (!accountObj) {
      return NextResponse.json({ error: "YES", message: "Account not found" }, { status: 404 });
    }

    let openTrade = await Trade.findOne({ account: account, status: "Open" });
    if (openTrade) {
      return NextResponse.json({ error: "YES", message: "Our system has pending open trade, please try again or contact us" }, { status: 404 });
    }

    if (accountObj.balance != balance) {
      const newActivity = {
        title: "Balance issue",
        description: `Balance updated at open account phase. The old balance was ${accountObj.balance} and become ${balance}`,
      };
      accountObj.activity.push(newActivity);
      accountObj.balance = balance;
      await accountObj.save();
    }

    if (accountObj.status != "Live") {
      return NextResponse.json({ error: "YES", message: "Trades not allowed on this account" }, { status: 400 });
    }

    if (balance >= accountObj.target) {
      if (accountObj.company === "Funding Pips") {
        if (accountObj.phase === 1 || accountObj.phase === 2) {
          const newActivity = {
            title: "Target reach detection at open trade phase",
            description: `Trader try to open trade when target was already reached with wrong reported balance. Old balance was ${accountObj.balance} and the real is ${balance}`,
          };
          accountObj.activity.push(newActivity);
          accountObj.status = "Upgrade";
          accountObj.comment = "Congrats trader! You can now upgrade your account";
          accountObj.upgradeDate = Date.now();
          await accountObj.save();
          return NextResponse.json({ error: "YES", message: "Your account is ready for upgrade. Upgrade it now!" }, { status: 400 });
        } else if (accountObj.phase === 3) {
          // Εδώ ορίζω το payment date 4 μέρες αργότερα και μετά ελέγχω την ημερομηνία για να αλλάξω τα texts ανάλογα
          const paymentDate = new Date(accountObj.firstTradeDate);
          paymentDate.setHours(0, 0, 0, 0);
          paymentDate.setDate(paymentDate.getDate() + 4);
          if (paymentDate.getTime() >= Date.now()) {
            accountObj.comment = `Congrats trader! You can now request for payout`;
            accountObj.paymentDate = Date.now();
            const newActivity = {
              title: "Target reach detection at open trade phase",
              description: `Trader try to open trade when target was already reached with wrong reported balance. Trader can now make a payout request`,
            };
            accountObj.activity.push(newActivity);
            await accountObj.save();
            return NextResponse.json({ error: "YES", message: "Your account is ready for payout request. You can request now!" }, { status: 400 });
          } else {
            accountObj.comment = `Congrats trader! You can request for payout at ${paymentDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
            accountObj.paymentDate = paymentDate;
            const newActivity = {
              title: "Target reach detection at open trade phase",
              description: `Trader try to open trade when target was already reached with wrong reported balance. Trader can make payout request at ${paymentDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
            };
            accountObj.activity.push(newActivity);
            await accountObj.save();
            return NextResponse.json({ error: "YES", message: `You have reach the target. You can request a payout at ${paymentDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}` }, { status: 400 });
          }
        }
      }
      // #NewCompany
    } else {
      //Εδώ βρίσκουμε τον user του account
      const user = await clerkClient.users.getUser(accountObj.userId);
      if (!user) {
        return NextResponse.json({ error: "YES", message: "User not found" }, { status: 404 });
      }

      //Εδώ βρίσκω τα pairs που έχει βάλει η ομάδα του χρήστη
      const usedPairs = await Trade.find({
        userId: { $in: user.publicMetadata.team },
        status: "Open",
        company: accountObj.company,
        openAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }).distinct("pair");

      // Βρίσκω το array με τα objects των σημερινών pairs
      const dayPairs = settingsObj.plan[day][GetCompany(accountObj.company)].list;

      // Εδώ βρίσκω το index του pair του plan list
      const pairIndex = FindPairIndex(dayPairs, usedPairs, settingsObj.plan[day][GetCompany(accountObj.company)].currentId);
      if (pairIndex === 500) {
        return NextResponse.json({ error: "YES", message: "Sorry, there is not available pair at the moment" }, { status: 400 });
      }

      // Εδώ φτιάχνω το newTrade
      const planPair = settingsObj.plan[day][GetCompany(accountObj.company)].list[pairIndex];
      const initialLots = settingsObj.lots[planPair.pair];
      const newLots = planPair.lastLots < initialLots ? (initialLots * (1 + (Math.random() * (8 - 3) + 3) / 100)).toFixed(2) : (initialLots * (1 - (Math.random() * (12 - 3) + 3) / 100)).toFixed(2);
      const takeProfit = await accountObj.GetTakeProfit(newLots);
      const stopLoss = await accountObj.GetStopLoss();

      const newTrade = {
        userId: user.id,
        account: account,
        company: accountObj.company,
        startingBalance: balance,
        pair: planPair.pair,
        lots: newLots,
        position: planPair.lastPosition === "Buy" ? "Sell" : "Buy",
        status: "Open",
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        fake: false,
      };

      // Αποθήκευση νέου trade
      const trade = new Trade(newTrade);
      await trade.save();
      await accountObj.OpenTrade(newTrade);
      return NextResponse.json({ error: "NO", pair: planPair.pair, position: planPair.lastPosition === "Buy" ? "Sell" : "Buy", lots: newLots, stoploss: stopLoss, takeprofit: takeProfit });
    }
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/open-trade");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}

const GetCompany = (company) => {
  let planCompany;
  switch (company) {
    case "Funding Pips":
      planCompany = "fundingPips";
      break;
    case "FTMO":
      planCompany = "ftmo";
      break;
    default:
      break;
  }
  return planCompany;
};

const FindPairIndex = (planList, usedPairs, startIndex) => {
  for (let i = startIndex; i < planList.length; i++) {
    if (!usedPairs.includes(planList[i].pair)) {
      return i;
    }
  }

  for (let i = 0; i < startIndex; i++) {
    if (!usedPairs.includes(planList[i].pair)) {
      return i;
    }
  }

  return 500;
};
