import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  console.log("sdfa");
  try {
    await dbConnect();
    const user = await currentUser();
    const { username, firstName, lastName, mentor } = await req.json();
    const params = { username: username, firstName: firstName, lastName: lastName };
    await clerkClient.users.updateUser(user.id, params);
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "trader",
        active: false,
        registered: true,
        mentor: mentor,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
