import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Settings from "@/models/Settings";
import { ErrorHandler } from "@/library/functions";

export async function GET(req, context) {
  try {
    await dbConnect();
    let doc = await Settings.findOne();
    if (!doc) {
      const newSettings = new Settings();
      await newSettings.save();
      return NextResponse.json(newSettings);
    }
    return NextResponse.json(doc);
  } catch (error) {
    console.log("Error from /api/admin/settings/get-settings", error);
    const response = await ErrorHandler("Admin", error, "Something went wrong while gettings settings. Please refresh the page.", "/api/admin/settings/get-settings");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
