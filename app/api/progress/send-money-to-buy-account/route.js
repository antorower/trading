import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { accountId, company, capital, wallet, amount } = await req.json();

    let doc = await Account.findById(accountId);
    if (!doc || user.id != doc.userId) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const data = { company: company, capital: capital, wallet: wallet, amount: amount };
    await doc.FundsTransferred(data);
    return NextResponse.json({ sucess: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/progress/send-money-to-buy-account");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
