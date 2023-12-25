import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  try {
    await dbConnect();

    // Παίρνω το input userId και κάνω τον user active
    const { userId } = await req.json();
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        active: true,
      },
    });

    return NextResponse.json({ sucess: true });
  } catch (error) {
    const response = await ErrorHandler({}, error, "Something went wrong, please try again", "/api/admin/activate-user");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
