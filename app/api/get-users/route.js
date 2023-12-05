import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient, currentUser } from "@clerk/nextjs";

export async function GET() {
  try {
    await dbConnect();
    const user = await currentUser();
    const users = await clerkClient.users.getUserList();

    if (user?.publicMetadata?.role === "admin") {
      return NextResponse.json(users);
    }
    if (user?.publicMetadata?.role === "leader") {
      const mentoredUsers = users.filter((user) => user.publicMetadata.mentor === user.id);
      return NextResponse.json(mentoredUsers);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.log("Error from /api/admin/users/get-users", error);
    const response = await ErrorHandler(user, error, "Something went wrong while retrieving users.", "/api/admin/users/get-users");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
