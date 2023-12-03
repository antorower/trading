import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  try {
    await dbConnect();
    const user = await currentUser();
    const { wallet } = await req.json();

    const EthereumWalletValidation = () => {
      return /^0x[a-fA-F0-9]{40}$/.test(wallet);
    };

    if (!wallet || !EthereumWalletValidation()) {
      return NextResponse.json({ error: "The wallet address you have submitted does not conform to the recognized Ethereum wallet format." }, { status: 400 });
    }

    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        wallet: wallet,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/user/update-wallet", error);
    const response = await ErrorHandler(user, error, "Something went wrong. Please try again.", "/api/user/update-wallet");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
