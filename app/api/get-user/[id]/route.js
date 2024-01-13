import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function GET(context) {
  await dbConnect();
  const user = await currentUser();
  const id = context.params.id;

  if (!user) {
    return NextResponse.json({ error: "Permissions required" }, { status: 404 });
  }

  const requestedUser = await clerkClient.users.getUser(id);

  if (requestedUser) {
    return NextResponse.json(requestedUser);
  } else {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
