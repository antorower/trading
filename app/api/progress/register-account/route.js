import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
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
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/register-account");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
