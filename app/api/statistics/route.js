import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";

export async function GET(req, context) {
  let numberOfAccounts5K = 0;
  let numberOfAccounts10K = 0;
  let numberOfAccounts25K = 0;
  let numberOfAccounts50K = 0;
  let numberOfAccounts100K = 0;
  let numberOfAccounts200K = 0;
  let numberOfAccounts300K = 0;

  await dbConnect();
  let accounts = await Account.find({
    status: { $in: ["Live", "Upgrade", "Payout", "Payment"] },
  });
  if (!accounts || !accounts.length) {
    return NextResponse.json({ error: message }, { status: 404 });
  } else {
    accounts.forEach((account) => {
      const capital = account.capital;

      // Αυτό το κάνω για να ξέρω πόσα accounts υπάρχουν από το κάθε κεφάλαιο
      if (capital === 5000) numberOfAccounts5K++;
      else if (capital === 10000) numberOfAccounts10K++;
      else if (capital === 25000) numberOfAccounts25K++;
      else if (capital === 50000) numberOfAccounts50K++;
      else if (capital === 100000) numberOfAccounts100K++;
      else if (capital === 200000) numberOfAccounts200K++;
      else if (capital === 300000) numberOfAccounts300K++;
    });

    // Prepare the response data with the counts
    const responseData = {
      numberOfAccounts5K,
      numberOfAccounts10K,
      numberOfAccounts25K,
      numberOfAccounts50K,
      numberOfAccounts100K,
      numberOfAccounts200K,
    };

    // Return the counts instead of the raw accounts data
    return NextResponse.json(responseData);
  }
}
