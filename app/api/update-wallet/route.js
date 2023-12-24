import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { wallet } = await req.json();

    // Validation function
    const EthereumWalletValidation = () => {
      return /^0x[a-fA-F0-9]{40}$/.test(wallet);
    };

    // Validate wallet format
    if (!wallet || !EthereumWalletValidation()) {
      return NextResponse.json({ error: "The wallet address you have submitted does not conform to the recognized Ethereum wallet format." }, { status: 400 });
    }

    // Κάνει update το προσωπικό wallet του ethereum
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        personalEthWallet: wallet,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/update-wallet");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
