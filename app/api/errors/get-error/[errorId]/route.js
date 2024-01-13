import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import AppError from "@/models/AppError";

export async function GET(req, context) {
  const user = await currentUser();
  try {
    await dbConnect();
    const errorId = context.params.errorId;

    let adminUser = await User.findOne({ clerkId: user.id });
    if (!adminUser || adminUser?.role != "admin") {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }
    let doc = await AppError.findById(errorId);
    if (!doc) {
      return NextResponse.json({ error: "Error not found" }, { status: 404 });
    } else {
      return NextResponse.json(doc);
    }
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/errors/get-error");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
