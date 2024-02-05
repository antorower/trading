import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";

export async function GET(req, context) {
  await dbConnect();
  const phase = +context.params.phase;

  let accounts = await Account.find({ phase: phase });
  return NextResponse.json(accounts);
}
