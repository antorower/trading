import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import Account from "@/models/Account";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  const user = await currentUser();
  try {
    const { accountId, comment } = await req.json();
    await dbConnect();

    if (user.publicMetadata.role != "admin") {
      return Response.json({ error: "Unauthorized request" }, 401);
    }

    let doc = await Account.findById(accountId);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    await doc.RejectAccount(comment);
    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/progress/reject-account");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
