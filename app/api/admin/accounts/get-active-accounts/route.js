import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";

export async function GET(req, context) {
  try {
    await dbConnect();
    let docs = await Account.find({ status: { $nin: ["Lost", "Rejected"] } });
    if (!docs || !docs.length) {
      return NextResponse.json({ error: "There is not active accounts" });
    } else {
      return NextResponse.json(docs);
    }
  } catch (error) {
    console.log("Error from /api/admin/accounts/get-active-accounts", error);
    const response = await ErrorHandler(user, error, "Something went wrong while fetching active accounts. Please refresh the page.", "/api/admin/accounts/get-active-accounts");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
