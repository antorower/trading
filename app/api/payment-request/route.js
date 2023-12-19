import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";
import Payout from "@/models/Payout";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await currentUser();
    const { accountNumber } = await req.json();
    let account = await Account.findOne({ number: accountNumber });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (user.id != account.userId) {
      return NextResponse.json({ error: "You have not permissions for this action" }, { status: 400 });
    }    
    await account.PaymentAccount();

      const data = {
        owner: user.id,
        account: accountNumber,
        amount: account.balance - account.capital,
      }
    const newPendingPayout = new Payout();
    await newPendingPayout.PaymentRequestDone(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/payment-request", error);
    const response = await ErrorHandler(user, error, "Something went wrong while processing your request to delete an account.", "/api/payment-request");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
