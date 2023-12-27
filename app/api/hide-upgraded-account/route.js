import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req, context) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Permissions required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const { accountId } = await req.json();
    if (!accountId) {
      return NextResponse.json({ error: "Account is required" }, { status: 400 });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 400 });
    }

    if (account.userId != user.id) {
      return NextResponse.json({ error: "You do not have the required permissions" }, { status: 400 });
    }

    if (account.status !== "Upgraded") {
      return NextResponse.json({ error: "Account cannot be deleted" }, { status: 400 });
    }

    account.deletedFromUser = true;
    await account.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/hide-lost-account");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
