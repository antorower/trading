import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";

export async function GET(req, context) {
  try {
    await dbConnect();
    const user = await currentUser();
    let docs = await Account.find({ user: user.id });
    if (!docs || !docs.length) {
      return NextResponse.json({ error: "You have not active accounts" });
    } else {
      return NextResponse.json(docs);
    }
  } catch (error) {
    console.log("Error from /api/user/get-active-accounts", error);
    const response = await ErrorHandler(
      user,
      error,
      "Something went wrong while fetching your accounts. Please refresh the page.",
      "/api/user/get-active-accounts"
    );
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
