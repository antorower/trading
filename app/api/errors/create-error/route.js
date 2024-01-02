import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import AppError from "@/models/AppError";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();

    const { user, errorMessage, errorsObject, file, location, statusCode } = await req.json();
    const doc = new AppError({ user: user, errorMessage: errorMessage, errorsObject: errorsObject, file: file, location: location, statusCode: statusCode });
    await doc.save();
    return NextResponse.json(doc);
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/errors/create-error");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
