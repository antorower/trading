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
      return NextResponse({ error: "Company is required" }, { status: 400 });
    }

    const newAccount = new Account();
    await newAccount.RequestAccount({ userId: user.id, company: company });

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/progress/request-new-account");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
