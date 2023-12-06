import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req, context) {
  const user = await currentUser();
  try {
    await dbConnect();

    const { accountId } = await req.json();

    if (!accountId) {
      const error = new Error("Account is required");
      error.status = 400;
      throw error;
    }
    const account = await Account.findById(accountId);
    if (!account) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    if (account.userId != user.id) {
      const error = new Error("You do not have the required permissions");
      error.status = 400;
      throw error;
    }

    if (account.status !== "Lost" && account.status !== "Review") {
      const error = new Error("Account cannot be deleted");
      error.status = 403;
      throw error;
    }

    account.deletedFromUser = true;
    await account.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/user/delete-account/account._id", error);
    const response = await ErrorHandler(user, error, "Something went wrong while processing your request to delete an account.", `/api/user/delete-account/${context.params.accountId}`);
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
