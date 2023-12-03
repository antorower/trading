import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await currentUser();

    return NextResponse.json({ wallet: user.publicMetadata.wallet });
  } catch (error) {
    console.log("Error from /api/user/get-wallet", error);
    const response = await ErrorHandler(user, error, "Something went wrong. Please try again.", "/api/user/get-wallet");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
