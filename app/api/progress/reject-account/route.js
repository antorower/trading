import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  await dbConnect();
  const user = await currentUser();
  const { accountId, comment } = await req.json();

  if (user.publicMetadata.role != "admin") {
    return Response.json({ error: "Unauthorized request" }, 401);
  }

  try {
    let doc = await Account.findById(accountId);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    await doc.RejectAccount(comment);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/progress/reject-account", error);
    const response = await ErrorHandler(user, error, "Something went wrong while fetching active accounts. Please refresh the page.", "/api/progress/reject-account");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
