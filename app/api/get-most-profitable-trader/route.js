import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import { ErrorHandler } from "@/library/functions";
import { clerkClient } from "@clerk/nextjs";
import Payout from "@/models/Payout";

export async function GET(req, context) {
  try {
    await dbConnect();

    // Get the start of the current month
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    // Retrieve all users
    const users = await clerkClient.users.getUserList({ limit: 400 });
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Not users found" }, { status: 404 });
    }

    // Retrieve all accepted payouts from the start of the current month until now
    let payouts = await Payout.find({
      acceptedDate: { $gte: startOfCurrentMonth },
      status: "Accepted",
    });

    // Check if there are payouts
    if (!payouts || !payouts.length) {
      return NextResponse.json({ profits: 0 });
    }

    // Sum amounts for each user and map usernames to the sum
    const profits = payouts.reduce((acc, payout) => {
      const userId = payout.owner;
      if (!acc[userId]) {
        acc[userId] = 0;
      }
      acc[userId] += payout.amount;
      return acc;
    }, {});

    // Create an array with usernames and their total profits
    const userProfits = Object.keys(profits).map((userId) => {
      const user = users.find((u) => u.id === userId);
      return { username: user.username, totalProfit: profits[userId] };
    });

    // Return the array of users and their profits
    return NextResponse.json(userProfits);
  } catch (error) {
    const response = await ErrorHandler(user, error, "Something went wrong, please try again", "/api/get-user-profits");
    return NextResponse.json({ error: response.message ? response.message : "Something went wrong, please try again" }, { status: response.status ? response.status : 500 });
  }
}
