import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { newAccount, oldAccount } = await req.json();

    const account = await Account.findOne({ number: oldAccount });
    if (!account) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (user.id != account.userId) {
      return NextResponse.json({ error: "You have no permissions on this account" }, { status: 404 });
    }

    account.chain.nextAccount = newAccount;
    account.upgradedDate = Date.now();
    account.status = "Upgraded";
    await account.save();

    const upgradedAccount = new Account();
    await upgradedAccount.UpgradeAccount(account, newAccount);

    return NextResponse.json(account);
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/upgrade-account");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
