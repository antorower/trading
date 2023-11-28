import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await currentUser();
    const { company } = await req.json();

    const requestedAccount = {
      user: user.id,
      username: user.username,
      fistName: user.firstName,
      lastName: user.lastName,
      company: company,
    };
    await Account.create(requestedAccount);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.clerkError) {
      return NextResponse.json({ error: "An authentication error occurred during your request." }, { status: error.status });
    }
    return NextResponse.json({ error: error.message });
  }
}
