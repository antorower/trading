import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import User from "@/models/User";
import AppError from "@/models/AppError";

export async function GET(req, context) {
  const user = await currentUser();
  try {
    await dbConnect();

    let adminUser = await User.findOne({ clerkId: user.id });
    if (!adminUser || adminUser?.role != "admin") {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }
    let docs = await AppError.find({ solved: false });
    if (!docs) {
      return NextResponse.json({ error: "Error not found" }, { status: 404 });
    } else {
      return NextResponse.json(docs);
    }
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/errors/get-all-errors");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
