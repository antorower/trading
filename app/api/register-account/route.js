import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await currentUser();
    const { accountId, accountNumber } = await req.json();

    let accountWithSameNumber = await Account.findOne({ number: accountNumber });
    if (accountWithSameNumber) {
      return NextResponse.json({ error: "Account already exist" }, { status: 400 });
    }

    let doc = await Account.findById(accountId);

    if (user.id != doc.userId) {
      return NextResponse.json({ error: "You don't have persmission to register this account" }, { status: 400 });
    }

    if (doc.status != "Registration") {
      return NextResponse.json({ error: "The account number cannot be altered" }, { status: 400 });
    }

    await doc.RegisterAccount(accountNumber);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/register-account", error);
    const response = await ErrorHandler(user, error, "Something went wrong while account registering. Please refresh the page.", "/api/register-account");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
