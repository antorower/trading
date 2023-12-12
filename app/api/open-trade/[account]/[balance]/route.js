import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";
import Settings from "@/models/Settings";
import Trade from "@/models/Trade";
import { clerkClient } from "@clerk/nextjs";

export async function GET(req, context) {
  try {
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

    const settingsObj = await Settings.findOne();
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    const accountObj = await Account.findOne({ number: account });
    if (!doc) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const user = await clerkClient.users.getUser(accountObj.userId);
    const team = user.publicMetadata.team;

    let openTradesArray = await Trade.find({ userId: accountObj.userId });

    const trade = {
      pair: "EURUSD",
      position: "BUY",
      lots: 2,
    };
    await doc.OpenTrade(trade, false);
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error finding document:", error);
    return NextResponse.json({ error: error.message });
  }
}
