import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";

export async function GET(req, context) {
  console.log("Nice");
  try {
    await dbConnect();
    const account = context.params.account;
    const balance = context.params.balance;
    console.log("Account", account);
    console.log("Balance", balance);
    return NextResponse.json({ pair: "EURUSD", lots: 2, shit: 4 });
  } catch (error) {
    console.log(error);
  }
}
