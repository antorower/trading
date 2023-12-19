import mongoose from "mongoose";

const PayoutSchema = new mongoose.Schema(
  {
    owner: String,
    account: String,
    amount: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    acceptedDate: Date,
  }
);

PayoutSchema.methods.PaymentRequestDone = async function (data) {
  try {
    this.owner = data.owner;
    this.account = data.account;
    this.amount = data.amount;
    this.status = "Pending";
    this.createdDate = Date.now();

    await this.save();
  } catch (error) {
    console.error("Error in PaymentRequestDone method:", error);
    throw error;
  }
};

const Payout = mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);

export default Payout;
