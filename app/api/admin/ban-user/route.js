import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        banned: true,
      },
    });
    return NextResponse.json({ sucess: true });
  } catch (error) {
    console.log("Error from /api/admin/users/user/ban-user", error);
    const response = await ErrorHandler({}, error, "Something went wrong. Please try again.", "/api/admin/users/user/ban-user");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
