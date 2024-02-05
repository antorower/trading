import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { ErrorHandler } from "@/library/functions";

import Account from "@/models/Account";
import Trade from "@/models/Trade";

export async function GET(req, context) {
  try {
    await dbConnect();
    const account = context.params.account;
    const balance = Number(context.params.balance);

    // Αν το account ή το balance δεν υπάρχουν επιστρέφω error
    if (!account || isNaN(balance)) {
      return NextResponse.json({ error: "YES", message: "Inputs are wrong" }, { status: 400 });
    }

    // Τραβάω το account. Αν δεν βρεθεί account επιστρέφει error.
    let accountObj = await Account.findOne({ number: account });
    if (!accountObj) {
      return NextResponse.json({ error: "YES", message: "Account not found" }, { status: 404 });
    }
    let trade = await Trade.findOne({ account: account, status: "Open" });
    if (!trade) {
      return NextResponse.json({ error: "YES", message: "Seems like there is no open trade in our databases, please contact us" }, { status: 404 });
    }
    await trade.CloseTrade();
    await accountObj.CloseTrade(balance);

    return NextResponse.json({ error: "NO", message: "Your account details updated successfully" });
  } catch (error) {
    const response = await ErrorHandler({}, error, "Something went wrong, please try again", "/api/close-trade");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
/*
const GetCompany = (company) => {
  let planCompany;
  switch (company) {
    case "Funding Pips":
      planCompany = "fundingPips";
      break;
    case "FTMO":
      planCompany = "ftmo";
      break;
    default:
      break;
  }
  return planCompany;
};
*/
