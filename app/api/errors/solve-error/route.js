import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import User from "@/models/User";
import AppError from "@/models/AppError";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();

    const { errorId } = await req.json();
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
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/errors/solve-error");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
