import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import UserPayment from "@/models/UserPayment";

export async function POST(req) {
  const user = await currentUser();
  try {
    if (user.publicMetadata.role != "admin") {
      return NextResponse.json({ error: "Permissions required" }, { status: 400 });
    }

    await dbConnect();
    const { userId, wallet, amount } = await req.json();

    // Αν κάποιο δεδομένο δεν υπάρχει τότε επιστρέφει λάθος
    if (!userId || !wallet || !amount) {
      return NextResponse.json({ error: "Not all data provided" }, { status: 400 });
    }

    // Αποθηκεύει τα publicMetadata του user
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        payday: Date.now(),
      },
    });

    // Create a new UserPayment document
    const newPayment = new UserPayment({
      user: userId,
      wallet: wallet,
      amount: amount,
    });

    // Save the new payment to the database
    await newPayment.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/change-payroll-state");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
