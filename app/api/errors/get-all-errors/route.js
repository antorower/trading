import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import User from "@/models/User";
import AppError from "@/models/AppError";

export async function GET(req, context) {
  await dbConnect();
  const user = await currentUser();

  try {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
