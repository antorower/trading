import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { ErrorHandler } from "@/library/functions";
import { clerkClient } from "@clerk/nextjs";
import Payout from "@/models/Payout";

export async function GET(req, context) {
  const fundingPipsTradersShare = 0.15;
  const fundingPipsLeadersShare = 0.15;

  const userId = context.params.userId;

  const user = await clerkClient.users.getUser(userId);

  try {
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await dbConnect();

    let profit = 0;
    let payrollUsers = 0;

    if (user.publicMetadata.payroll || user.publicMetadata.role === "admin" || user.publicMetadata.role === "leader") {
      // Η λίστα με όλους τους users
      const users = await clerkClient.users.getUserList({ limit: 400 });
      if (!users || users.length === 0) {
        return NextResponse.json({ error: "Not users found" }, { status: 404 });
      }

      // Η λίστα με τα payouts από την ημερομηνία της τελευταίας πληρωμής και μετά
      const lastPayday = new Date(user.publicMetadata.payday);
      console.log("Last Payday: ", lastPayday);
      let payouts = await Payout.find({
        acceptedDate: { $gt: lastPayday },
        status: "Accepted",
      });
      if (!payouts || !payouts.length) {
        return NextResponse.json({ profit: 0 });
      }

      if (user.publicMetadata.payroll) {
        // Βρίσκω τον αριθμό των users που πληρώνονται
        users.forEach((user) => {
          if (user.publicMetadata.payroll) {
            payrollUsers = payrollUsers + 1;
          }
        });
        if (payrollUsers === 0) {
          return NextResponse.json({ error: "Payroll users can not be zero" }, { status: 400 });
        }
        console.log(payrollUsers);
        console.log(payouts);

        // Λουπάρω στα payouts
        payouts.forEach((payout) => {
          if (payout.company === "Funding Pips") {
            profit = profit + (payout.amount * fundingPipsTradersShare) / payrollUsers;
          }
        });
      }
      console.log(profit);
      if (user.publicMetadata.role === "leader") {
        let team = [];
        users.forEach((potentialTeamMember) => {
          if (potentialTeamMember.publicMetadata.mentor === user.id) {
            team.push(potentialTeamMember.id);
          }
        });
        let teamPayouts = await Payout.find({
          acceptedDate: { $gt: lastPayday },
          owner: { $in: team },
        });
        teamPayouts.forEach((payout) => {
          if (payout.company === "Funding Pips") {
            profit = profit + payout.amount * fundingPipsLeadersShare;
          }
        });
      }
      return NextResponse.json({ profit });
    } else {
      return NextResponse.json({ error: "Permissions required" }, { status: 400 });
    }
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/get-user-profits");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
