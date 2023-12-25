import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Settings from "@/models/Settings";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  try {
    await dbConnect();
    const { startDay, endDay, startMonth, endMonth } = await req.json();
    const data = { startDay: startDay, endDay: endDay, startMonth: startMonth, endMonth: endMonth };
    let doc = await Settings.findOne();
    if (!doc) {
      return NextResponse.json({ error: "Settings document not found" }, { status: 404 });
    }
    await doc.ResetSchedule(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler({}, error, "Something went wrong, please try again", "/api/admin/settings/reset-settings");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
