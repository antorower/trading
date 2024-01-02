import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";
import { ErrorHandler } from "@/library/functions";

export async function POST(req) {
  const user = await currentUser();
  try {
    await dbConnect();
    const { username, firstName, lastName, mentor } = await req.json();

    // Γίνεται validation
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

    // Αν κάποιο δεδομένο δεν υπάρχει τότε επιστρέφει λάθος
    if (!mentor || !username || !firstName || !lastName) {
      return NextResponse.json({ error: "Not all required information provided, please contact us" }, { status: 400 });
    }

    // Αν τα δεδομένα δεν πληρούν τις προϋποθέσεις επιστρέφει λάθος
    if (!UsernameValidation(username) || !FirstNameValidation(firstName) || !LastNameValidation(lastName)) {
      return NextResponse.json({ error: "The provided data does not adhere to the expected format" }, { status: 422 });
    }

    // Το πρώτο γράμμα στο ονοματεπώνυμο το κάνει κεφαλαίο
    const updatedFristName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const updatedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    // Αποθηκεύει τα δεδομένα του user που είναι directly child του main object
    const params = { username: username, firstName: updatedFristName, lastName: updatedLastName };
    await clerkClient.users.updateUser(user.id, params);

    // Αποθηκεύει τα publicMetadata του user
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "trader",
        active: false,
        registered: true,
        mentor: mentor,
        banned: false,
        kyc: [],
        team: [user.id],
        personalEthereumWallet: "",
        teamEthereumWallet: {
          wallet: "",
          secretPhrase: "",
        },
        payroll: false,
        payday: Date.now(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/set-user");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
