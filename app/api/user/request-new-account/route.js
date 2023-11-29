import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { company } = await req.json();

    const requestedAccount = {
      user: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      company: company,
      activity: [],
      phase: "d",
    };
    await Account.create(requestedAccount);
    return NextResponse.json({ success: true });
  } catch (error) {
    //console.log("Error from /api/users/request-new-account", error);
    const response = await ErrorHandler(user, error, "Something went wrong while processing your request for a new account.", "/api/user/request-new-account");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
