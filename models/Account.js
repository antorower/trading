import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      trim: true,
      unique: true,
    },
    phase: {
      type: Number,
      min: 1,
      max: 3,
      required: true,
      default: 1,
    },
    capital: {
      type: Number,
      min: 5000,
      max: 300000,
      default: 5000,
    },
    balance: {
      type: Number,
      default: 5000,
    },
    status: {
      type: String,
      enum: ["Live", "Lost", "Review", "Upgrade", "Payout", "Payment", "Requested"],
      default: "Requested",
    },
    moneyTransfered: {
      type: Boolean,
      default: false,
    },
    moneyTransferDetails: {
      transferDate: Date,
      transferWallet: String,
      transferAmount: Number,
    },
    lastActivity: Date,
  },
  { timestamps: true }
);

const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default Account;
