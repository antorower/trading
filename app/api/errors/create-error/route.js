import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import AppError from "@/models/AppError";

export async function POST(req) {
  await dbConnect();

  const { user, errorMessage, errorsObject, file, location, statusCode } = await req.json();
  try {
    const doc = new AppError({ user: user, errorMessage: errorMessage, errorsObject: errorsObject, file: file, location: location, statusCode: statusCode });
    await doc.save();
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
