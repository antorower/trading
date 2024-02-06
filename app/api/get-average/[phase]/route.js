import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";

export async function GET(req, context) {
  await dbConnect();
  const phase = +context.params.phase;

  // Use MongoDB's aggregation framework to calculate the average balance
  const aggregation = await Account.aggregate([
    { $match: { phase: phase, status: "Live" } },
    {
      $group: {
        _id: null, // Group all documents into one for calculating the average
        averageBalance: { $avg: "$balance" }, // Calculate the average balance
      },
    },
  ]);

  // Check if the aggregation result is not empty and extract the average balance
  const averageBalance = aggregation.length > 0 ? aggregation[0].averageBalance : 0;

  return NextResponse.json({ averageBalance });
}
