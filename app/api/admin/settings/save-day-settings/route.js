import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Settings from "@/models/Settings";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  try {
    await dbConnect();
    const { day, pairs, startingTradingHour, endingTradingHour, lotsFactor, activeDay } = await req.json();

    let doc = await Settings.findOne();
    if (!doc) {
      return NextResponse.json({ error: "Settings document not found" }, { status: 404 });
    }
    doc.schedule[day].pairs = pairs;
    doc.schedule[day].startingTradingHour = startingTradingHour;
    doc.schedule[day].endingTradingHour = endingTradingHour;
    doc.schedule[day].lotsFactor = lotsFactor;
    doc.schedule[day].activeDay = activeDay;
    doc.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler({}, error, "Something went wrong, please try again", "/api/admin/settings/save-day-settings");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
