import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";
import Account from "@/models/Account";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();

    if (user.publicMetadata.role != "admin") {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }

    const { accountId } = await req.json();
    let doc = await Account.findById(accountId);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    doc.status = "Lost";
    await doc.save();
    return NextResponse.json(doc);
  } catch (error) {
    console.log("Error from /api/admin/account-lost", error);
    const response = await ErrorHandler(user, error, "Something went wrong. Please try again.", "/api/admin/account-lost");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
