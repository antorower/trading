import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Model";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await currentUser();
    const { id, company, capital, wallet, amount } = await req.json();

    let doc = await Account.findById(id);
    if (!doc || user.username != doc.username) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    await doc.FundsTransfered(company, capital, wallet, amount);
    return NextResponse.json(doc);
  } catch (error) {
    console.log("Error from /api/admin/accounts/account/send-money", error);
    const response = await ErrorHandler(user, error, "Something went wrong while fetching active accounts. Please refresh the page.", "/api/admin/accounts/account/send-money");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
