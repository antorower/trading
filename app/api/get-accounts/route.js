import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";
import { ErrorHandler } from "@/library/functions";
import { clerkClient } from "@clerk/nextjs";

export async function GET() {
  const user = await currentUser();
  try {
    await dbConnect();
    const users = await clerkClient.users.getUserList();
    console.log("API Users all: ", users);

    let allAccounts = await Account.find({
      $nor: [
        { status: "Lost", deletedFromUser: true },
        { status: "Upgraded", deletedFromUser: true },
      ],
    });

    // Augment each account with the corresponding user details
    const augmentedAccounts = await Promise.all(
      allAccounts.map(async (account) => {
        const trader = users.find((user) => user.id === account.userId);
        return { ...account.toObject(), user: trader };
      })
    );
    console.log("API Augmented Accounts: ", augmentedAccounts);
    // Filter accounts based on the user role
    let userAccounts = user.publicMetadata.active ? augmentedAccounts.filter((account) => account.userId === user.id && !account.deletedFromUser) : null;
    let teamAccounts = null;
    let adminAccounts = null;

    if (user.publicMetadata.role === "leader" || user.publicMetadata.role === "admin") {
      const mentoredUserIds = users.filter((searchedUser) => searchedUser.publicMetadata.mentor === user.id).map((searchedUser) => searchedUser.id);
      teamAccounts = augmentedAccounts.filter((account) => mentoredUserIds.includes(account.userId) && !["Review", "Rejected", "Lost"].includes(account.status));
    }

    if (user.publicMetadata.role === "admin") {
      adminAccounts = augmentedAccounts.filter((account) => account.status !== "Rejected" && account.status !== "Lost");
    }
    console.log("API Admin Accounts: ", adminAccounts);

    return NextResponse.json({ userAccounts, teamAccounts, adminAccounts });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/get-accounts");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
