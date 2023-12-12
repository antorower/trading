import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await currentUser();
    const { accountId, company, capital, wallet, amount } = await req.json();

    let doc = await Account.findById(accountId);
    if (!doc || user.id != doc.userId) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const data = { company: company, capital: capital, wallet: wallet, amount: amount };
    await doc.FundsTransferred(data);
    return NextResponse.json({ sucess: true });
  } catch (error) {
    console.log("Error from /api/progress/send-money-to-buy-account", error);
    const response = await ErrorHandler(user, error, "Something went wrong while fetching active accounts. Please refresh the page.", "/api/progress/send-money-to-buy-account");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
