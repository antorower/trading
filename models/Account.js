import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
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
      default: () => (Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111).toString(),
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
    },
    balance: {
      type: Number,
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
