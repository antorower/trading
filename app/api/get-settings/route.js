import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Settings from "@/models/Settings";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

export async function GET(req, context) {
  const user = await currentUser();
  const response = new NextResponse();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "https://suckmypip.com"); // Make sure to replace with your actual domain
  response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (!user) {
    return response.json({ error: "Permissions required" }, { status: 400 });
  }

  try {
    await dbConnect();
    let doc = await Settings.findOne();
    if (!doc) {
      const newSettings = new Settings();
      await newSettings.save();
      doc = newSettings;
    }
    response.json(doc);
    return response;
  } catch (error) {
    const errorHandlerResponse = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/get-settings");
    response.status(errorHandlerResponse.status ? errorHandlerResponse.status : 500);
    response.json({ error: errorHandlerResponse.message ? errorHandlerResponse.message : "Something went wrong, please try again" });
    return response;
  }
}
