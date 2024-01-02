import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { clerkClient, currentUser } from "@clerk/nextjs";

export async function GET() {
  const user = await currentUser();
  try {
    await dbConnect();
    if (!user) {
      return NextResponse.json({ error: "Permissions required" }, { status: 400 });
    }

    // Βρίσκω του users
    const users = await clerkClient.users.getUserList();

    // Αν τους ζητάει ο admin τους στέλνω όλους
    if (user?.publicMetadata?.role === "admin") {
      return NextResponse.json(users);
    }

    // Αν τους ζητάει το leader στέλνω μόνο τους δικούς του
    if (user?.publicMetadata?.role === "leader") {
      const mentoredUsers = users.filter((user) => user.publicMetadata.mentor === user.id);
      return NextResponse.json(mentoredUsers);
    }

    // Αν τους ζητάει trader στέλνω άδειο array
    return NextResponse.json([]);
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/get-users");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
