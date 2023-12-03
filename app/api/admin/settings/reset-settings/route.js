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
    console.log("Data: ", data);
    await doc.ResetSchedule(data);
    console.log(doc);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/admin/settings/reset-settings", error);
    const response = await ErrorHandler("Admin", error, "Something went wrong while gettings settings. Please refresh the page.", "/api/admin/settings/reset-settings");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
