import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";

import Account from "@/models/Account";
import Settings from "@/models/Settings";
import Trade from "@/models/Trade";

export async function GET(req, context) {
  console.log("Open Trade endpoint");
  try {
    let newTrade;
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
    const balance = context.params.balance;

    //Τραβάω τα settings
    const settingsObj = await Settings.findOne();
    if (!settingsObj) {
      return NextResponse.json({ error: "YES", message: "Settings not found" }, { status: 404 });
    }

    //Εδώ βρίσκουμε το account
    let accountObj = await Account.findOne({ number: account });
    if (!accountObj) {
      return NextResponse.json({ error: "YES", message: "Account not found" }, { status: 404 });
    }

    // Ελέγχω αν επιτρέπονται τα trades
    if (!accountObj.CheckIfTradeAllowed()) {
      return NextResponse.json({ error: "YES", message: "Trades not allowed" }, { status: 404 });
    }

    //Εδώ βρίσκουμε τον user του account
    const user = await clerkClient.users.getUser(accountObj.userId);
    if (!user) {
      return NextResponse.json({ error: "YES", message: "User not found" }, { status: 404 });
    }

    // Ελέγχει αν ο user έχει βάλει ήδη trade σήμερα
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const userTradeToday = await Trade.findOne({
      userId: user.id,
      openAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });
    if (userTradeToday) {
      return NextResponse.json({ error: "YES", message: "Trades not allowed" }, { status: 404 });
    }

    //Εδώ βρίσκω τα pairs που έχει βάλει η ομάδα του χρήστη
    const teamTrades = await Trade.find({
      userId: { $in: user.publicMetadata.team },
      status: "Open",
    }).distinct("pair");
    const usedPairs = teamTrades.map((trade) => trade.pair);

    // Βρίσκω όλα τα διαθέσιμα pairs
    const dayPairs = settings.plan[day][GetCompany(accountObj.company)].list;

    // Εδώ βρίσκω το index του pair του plan list
    const pairIndex = FindPairIndex(dayPairs, usedPairs, settings.plan[day][GetCompany(accountObj.company)].currentId);

    // Εδώ φτιάχνω το newTrade
    newTrade.pair = settings.plan[day][GetCompany(accountObj.company)].list[pairIndex].pair;

    const oldPosition = settings.plan[day][GetCompany(accountObj.company)].list[pairIndex].position;
    newTrade.position = oldPosition === "Buy" ? "Sell" : "Buy";

    const initialLots = settings.lots[newTrade.pair];
    const oldLots = settings.plan[day][GetCompany(accountObj.company)].list[pairIndex].lots;
    newTrade.lots = oldLots < initialLots ? (initialLots * (1 + (Math.random() * (15 - 5) + 5) / 100)).toFixed(2) : (initialLots * (1 - (Math.random() * (15 - 5) + 5) / 100)).toFixed(2);

    // Στο τελος πρεπει να αυξησω το currentId κατά 1
    return NextResponse.json(settingsObj.schedule[day].pairs);
  } catch (error) {
    console.error("Error finding document:", error);
    return NextResponse.json({ error: error.message });
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
