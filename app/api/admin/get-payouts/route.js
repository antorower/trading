import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { ErrorHandler } from "@/library/functions";
import Payout from "@/models/Payout";

export async function GET() {
  try {
    await dbConnect();

    const twoMonthsAgo = subtractMonths(2);

    let payouts = await Payout.find({
      acceptedDate: { $gte: twoMonthsAgo },
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    const response = await ErrorHandler({}, error, "Something went wrong, please try again", "/api/get-accounts");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}

// Function to subtract months from a date
function subtractMonths(numOfMonths, date = new Date()) {
  date.setMonth(date.getMonth() - numOfMonths);
  return date;
}
