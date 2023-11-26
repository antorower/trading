import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import AppError from "@/models/AppError";

export async function POST(req) {
  await dbConnect();
  const user = await currentUser();

  const { error, location, statusCode } = await req.json();
  try {
    const doc = new AppError({ error: error, location: location, user: user.id, statusCode: statusCode });
    await doc.save();
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
