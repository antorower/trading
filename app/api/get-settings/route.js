import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Settings from "@/models/Settings";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

export async function GET(req, context) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Permissions required " }, { status: 400 });
  }

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
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/get-settings");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
