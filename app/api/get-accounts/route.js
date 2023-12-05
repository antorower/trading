import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";
import { ErrorHandler } from "@/library/functions";
import { clerkClient } from "@clerk/nextjs";

export async function GET() {
  try {
    await dbConnect();
    const user = await currentUser();
    const users = await clerkClient.users.getUserList();

    // Fetch all accounts with status not "Lost" from the database
    let allAccounts = await Account.find({ deletedFromUser: { $ne: true } });

    // Augment each account with the corresponding user details
    const augmentedAccounts = await Promise.all(
      allAccounts.map(async (account) => {
        const trader = users.find((user) => user.id === account.userId);
        return { ...account.toObject(), user: trader };
      })
    );

    // Filter accounts based on the user role
    let userAccounts = user.publicMetadata.active ? augmentedAccounts.filter((account) => account.userId === user.id && !account.deletedFromUser) : null;
    let teamAccounts = null;
    let adminAccounts = null;

    if (user.publicMetadata.role === "leader" || user.publicMetadata.role === "admin") {
      const mentoredUserIds = users.filter((user) => user.publicMetadata.mentor === user.id).map((user) => user.id);
      teamAccounts = augmentedAccounts.filter((account) => mentoredUserIds.includes(account.userId) && !["Review", "Rejected", "Lost"].includes(account.status));
    }

    if (user.publicMetadata.role === "admin") {
      adminAccounts = augmentedAccounts.filter((account) => account.status !== "Rejected" && account.status !== "Lost");
    }

    return NextResponse.json({ userAccounts, teamAccounts, adminAccounts });
  } catch (error) {
    console.log("Error from /api/get-accounts", error);
    const response = await ErrorHandler(user, error, "Something went wrong while fetching active accounts. Please refresh the page.", "/api/get-accounts");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
