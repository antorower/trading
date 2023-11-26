import mongoose from "mongoose";

const PayoutSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    amount: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Init",
    },
    acceptedDate: Date,
    comment: String,
  },
  { timestamps: true }
);

const Payout = mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);

export default Payout;
