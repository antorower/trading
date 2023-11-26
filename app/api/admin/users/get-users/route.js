import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";

export async function GET(req, context) {
  try {
    await dbConnect();
    const users = await clerkClient.users.getUserList();
    return NextResponse.json({ users: users });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
