import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

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

    // Ελέγχω αν είναι ΣΚ
    const day = SetCurrentDay();
    if (day === "sunday" || day === "saturday") {
      return NextResponse.json({ error: "Yes", message: "Trades not allowed today" });
    }
    await dbConnect();

    const account = context.params.account;
    const balance = Number(context.params.balance);
    //return NextResponse.json({ error: "No", pair: "USDJPY", position: "BUY", lots: 0.5, stoploss: 110, takeprofit: 450 });

    // ------------------------------ Account και Balance Validation ------------------------------
    // Αν το account ή το balance δεν υπάρχουν επιστρέφω error
    if (!account || isNaN(balance)) {
      return NextResponse.json({ error: "Yes", message: "Inputs are wrong" }, { status: 400 });
    }
    // Τραβάω το account. Αν δεν βρεθεί account με τον αριθμό που έδωσε ο χρήστης επιστρέφει error.
    let accountObj = await Account.findOne({ number: account });
    if (!accountObj) {
      return NextResponse.json({ error: "Yes", message: "Account not found" }, { status: 404 });
    }
    if (accountObj.status != "Live") {
      return NextResponse.json({ error: "Yes", message: "Trades not allowed on this account at the moment" }, { status: 400 });
    }
    if (!accountObj.needTrade) {
      return NextResponse.json({ error: "Yes", message: "Your account have already reach the target" }, { status: 400 });
    }
    if (accountObj.balanceMismatch) {
      return NextResponse.json({ error: "Yes", message: "Your trade could not be initiated due to a balance mismatch, please contact me" }, { status: 400 });
    }
    // ------------------------------ Account και Balance Validation ------------------------------

    // Αν το balance δεν είναι ενημερωμένο τότε το ενημερώνει και κάνει το account mismatch
    if (accountObj.balance != balance) {
      const newActivity = {
        title: "Balance discrepancy",
        description: `Balance updated at open account proccess. The old balance was ${accountObj.balance} and become ${balance}`,
      };
      accountObj.activity.push(newActivity);
      accountObj.balance = balance;
      accountObj.balanceMismatch = true;
      accountObj.comment = "You can not open trade due to a balance mismatch, please contact us";
      await accountObj.save();
      return NextResponse.json({ error: "Yes", message: "Your trade could not be initiated due to a balance mismatch, please contact us" }, { status: 400 });
    }

    // ------------------------------ Pull Settings and Active Day Validation ------------------------------
    // Τραβάω τα settings. Αν δεν βρεθούν επιστρέφω error.
    const settingsObj = await Settings.findOne();
    if (!settingsObj) {
      return NextResponse.json({ error: "Yes", message: "Settings not found" }, { status: 404 });
    }
    // Αν σήμερα δεν είναι active η μέρα επιστρέφω error
    if (!settingsObj.schedule[day].activeDay) {
      return NextResponse.json({ error: "Yes", message: "Today is not active day" }, { status: 400 });
    }
    const nowDate = new Date();
    const currentHour = nowDate.getHours();

    if (currentHour + 2 < settingsObj.schedule[day].startingTradingHour || currentHour + 2 > settingsObj.schedule[day].endingTradingHour) {
      return NextResponse.json({ error: "Yes", message: "Trading operations are not permitted during this hour" }, { status: 400 });
    }
    // ------------------------------ Pull Settings and Active Day Validation ------------------------------

    // Αν υπάρχει ανοιχτό trade επιστρέφω το error
    let openTrade = await Trade.findOne({ account: account, status: "Open" });
    if (openTrade) {
      //return NextResponse.json({ error: "Yes", message: "Our system has pending open trade, please try again or contact us" }, { status: 404 });
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++ ΕΝΕΡΓΟΠΟΙΗΣΗ +++++++++++++++++++++++++++++++++++++++++++++++++
    // Αν έχει ανοίξει trade σήμερα αυτό το account επιστρέφω error
    const todayTrade = await Trade.findOne({
      account: accountObj.number,
      openAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });
    if (todayTrade) {
      //return NextResponse.json({ error: "Yes", message: "You have already open a trade today" }, { status: 400 });
    }
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++ ΕΝΕΡΓΟΠΟΙΗΣΗ +++++++++++++++++++++++++++++++++++++++++++++++++

    if (balance >= accountObj.target) {
      if (accountObj.tradesExecuted < accountObj.minimumTradingDays) {
        const newActivity = {
          title: "Fake Trade",
          description: `Trader open a fake trade with balance ${accountObj.balance}`,
        };
        accountObj.activity.push(newActivity);

        const newTrade = {
          userId: account.userId,
          account: account,
          company: accountObj.company,
          startingBalance: balance,
          pair: GetRandomForexPair(),
          lots: 0.01,
          position: Math.random() < 0.5 ? "Buy" : "Sell",
          status: "Open",
          stopLoss: 0,
          takeProfit: 0,
          fake: true,
        };
        // Αποθήκευση νέου trade
        const trade = new Trade(newTrade);
        await trade.save();

        // Αλλαγές στο account μετά που ανοίγει το trade
        await accountObj.OpenTrade(newTrade);
        return NextResponse.json({ error: "No", pair: newTrade.pair, position: newTrade.position, lots: newTrade.lots, stoploss: newTrade.stopLoss, takeprofit: newTrade.takeProfit });
      } else {
        accountObj.comment = "Something didn't go as expected, please contact us";
        await accountObj.save();
        return NextResponse.json({ error: "Yes", message: "You can not open trade at this account. Your account have reach the target and you complete the required trading days" });
      }
    } else {
      //Εδώ βρίσκουμε τον user του account
      const user = await clerkClient.users.getUser(accountObj.userId);
      if (!user) {
        return NextResponse.json({ error: "Yes", message: "Account owner not found" }, { status: 404 });
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
        return NextResponse.json({ error: "Yes", message: "Sorry, there is not available pair at the moment" }, { status: 400 });
      }

      // Εδώ φτιάχνω το newTrade
      // Για να ειναι σωστό πρέπει απλά να αφαιρέσω το Math.floor και το /100
      const planPair = settingsObj.plan[day][GetCompany(accountObj.company)].list[pairIndex];
      const initialLots = settingsObj.lots[planPair.pair] * settingsObj.schedule[day].lotsFactor * (accountObj.capital / 10000);
      const newLots = planPair.lastLots < initialLots ? (initialLots * (Math.random() * (1.08 - 1.03) + 1.03)).toFixed(2) : (initialLots * (Math.random() * (0.97 - 0.92) + 0.92)).toFixed(2);
      let takeProfit = await accountObj.GetTakeProfit(newLots);
      let stopLoss = await accountObj.GetStopLoss(newLots);
      takeProfit = Math.floor(takeProfit * 0.7);
      stopLoss = Math.floor(stoploss * 0.7);
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

      // Αποθηκεύω τις global αλλαγές στα settings
      await settingsObj.OpenTrade(day, GetCompany(accountObj.company), pairIndex, newLots);

      // Αποθήκευση νέου trade
      const trade = new Trade(newTrade);
      await trade.save();

      // Αλλαγές στο account μετά που ανοίγει το trade
      await accountObj.OpenTrade(newTrade);
      return NextResponse.json({ error: "No", pair: newTrade.pair, position: newTrade.position, lots: newTrade.lots, stoploss: newTrade.stopLoss, takeprofit: newTrade.takeProfit });
    }
  } catch (error) {
    const response = await ErrorHandler({}, error, "Something went wrong, please try again", "/api/open-trade");
    return NextResponse.json({ error: "Yes", message: response.message ? response.message : "Something went wrong, please try again or contact me" }, { status: response.status ? response.status : 500 });
  }
}

const GetCompany = (company) => {
  let planCompany;
  switch (company) {
    case "Funding Pips":
      planCompany = "fundingPips";
      break;
    case "Alpha Capital":
      planCompany = "alphaCapital";
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

function GetRandomForexPair() {
  const forexPairs = ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURAUD", "EURJPY", "EURNZD", "EURCAD", "EURCHF", "GBPJPY", "GBPAUD", "GBPCAD", "GBPCHF", "GBPNZD", "AUDJPY", "AUDCAD", "AUDCHF", "AUDNZD", "NZDJPY", "NZDCAD", "NZDCHF", "CADJPY", "CADCHF", "CHFJPY"];
  return forexPairs[Math.floor(Math.random() * forexPairs.length)];
}
