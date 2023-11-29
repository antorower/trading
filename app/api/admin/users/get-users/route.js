import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";

export async function GET(req, context) {
  try {
    await dbConnect();
    const users = await clerkClient.users.getUserList();
    return NextResponse.json({ users: users });
  } catch (error) {
    console.log("Error from /api/admin/users/get-users", error);
    const response = await ErrorHandler(user, error, "Something went wrong while retrieving users.", "/api/admin/users/get-users");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
