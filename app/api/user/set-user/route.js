import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req) {
  const UsernameValidation = (value) => {
    if (/^[a-zA-Z0-9]{0,12}$/.test(value) && value.length >= 3 && value.length <= 12) {
      return true;
    }
    return false;
  };
  const FirstNameValidation = (value) => {
    if (/^[a-zA-Z]+$/.test(value) && value.length >= 3 && value.length <= 15) {
      return true;
    }
    return false;
  };
  const LastNameValidation = (value) => {
    if (/^[a-zA-Z]+$/.test(value) && value.length >= 3 && value.length <= 15) {
      return true;
    }
    return false;
  };

  try {
    await dbConnect();
    const user = await currentUser();
    const { username, firstName, lastName, mentor } = await req.json();

    if (!mentor || !username || !firstName || !lastName) {
      return NextResponse.json({ error: "Not all required information provided. Please contact us." }, { status: 400 });
    }

    if (!UsernameValidation(username) || !FirstNameValidation(firstName) || !LastNameValidation(lastName)) {
      return NextResponse.json({ error: "The provided data does not adhere to the expected format." }, { status: 422 });
    }

    const updatedFristName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const updatedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    const params = { username: username, firstName: updatedFristName, lastName: updatedLastName };
    await clerkClient.users.updateUser(user.id, params);
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "trader",
        active: false,
        registered: true,
        mentor: mentor,
        banned: false,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error from /api/user/set-user", error);
    const response = await ErrorHandler(user, error, "Something went wrong. Please try again.", "/api/user/set-user");
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
}
