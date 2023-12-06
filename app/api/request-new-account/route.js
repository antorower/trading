import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { company } = await req.json();

    if (!company) {
      const error = new Error("Company is required");
      error.status = 400;
      throw error;
    }

    const requestedAccount = {
      userId: user.id,
      company: company,
      phase: 1,
      activity: [],
    };

    await Account.create(requestedAccount);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/users/request-new-account", error);
    const response = await ErrorHandler(user, error, "Something went wrong while processing your request for a new account.", "/api/user/request-new-account");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
