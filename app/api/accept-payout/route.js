import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Payout from "@/models/Payout";
import Account from "@/models/Account";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { accountNumber, amount } = await req.json();

    if (user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "You do not have permissions for that action" }, { status: 400 });
    }

    let payout = await Payout.findOne({ account: accountNumber, status: "Pending" });
    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }
    await payout.PayoutDone(amount);

    let account = await Account.findOne({ number: accountNumber });
    if (!account) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    await account.PayoutAccount(amount, payout.wallet);

    return NextResponse.json(payout);
  } catch (error) {
    console.log("Error from /api/accept-payout", error);
    const response = await ErrorHandler(user, error, "Something went wrong while processing your request to delete an account.", "/api/accept-payout");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
