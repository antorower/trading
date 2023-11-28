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
    return NextResponse.json({ error: error.message });
  }
}
