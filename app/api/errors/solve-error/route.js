import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import User from "@/models/User";
import AppError from "@/models/AppError";

export async function POST(req) {
  await dbConnect();
  const user = await currentUser();

  const { errorId } = await req.json();
  try {
    let adminUser = await User.findOne({ clerkId: user.id });
    if (!adminUser || adminUser?.role != "admin") {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }
    let doc = await AppError.findById(errorId);
    if (!doc) {
      return NextResponse.json({ error: "Error not found" }, { status: 404 });
    } else {
      doc.solved = true;
      await doc.save();
      return NextResponse.json(doc);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
