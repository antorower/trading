import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

export async function GET(req, context) {
  try {
    await dbConnect();
    const clerkId = context.params.clerkId;
    const user = await clerkClient.users.getUser(clerkId);
    return NextResponse.json(user);
  } catch (error) {
    console.log("Error from /api/admin/users/user/get-user/[clerkId]", error);
    const response = await ErrorHandler(user, error, "Something went wrong. Please try again.", "/api/admin/users/user/get-user/[clerkId]");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
