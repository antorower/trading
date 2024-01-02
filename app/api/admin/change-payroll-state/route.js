import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  const user = await currentUser();
  try {
    if (user.publicMetadata.role != "admin") {
      return NextResponse.json({ error: "Permissions required" }, { status: 400 });
    }

    await dbConnect();
    const { userId, state } = await req.json();

    // Αν κάποιο δεδομένο δεν υπάρχει τότε επιστρέφει λάθος
    if (!userId) {
      return NextResponse.json({ error: "Not user id provided" }, { status: 400 });
    }

    // Αποθηκεύει τα publicMetadata του user
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        payroll: !state,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/change-payroll-state");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
