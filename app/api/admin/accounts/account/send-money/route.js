import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  try {
    console.log("Good");
    await dbConnect();
    const user = await currentUser();
    const { accountId, company, capital, wallet, amount } = await req.json();

    let doc = await Account.findById(accountId);
    if (!doc || user.username != doc.username) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const data = { company: company, capital: capital, wallet: wallet, amount: amount };
    await doc.FundsTransferred(data);
    return NextResponse.json(doc);
  } catch (error) {
    console.log("Error from /api/admin/accounts/account/send-money", error);
    const response = await ErrorHandler(user, error, "Something went wrong while fetching active accounts. Please refresh the page.", "/api/admin/accounts/account/send-money");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
