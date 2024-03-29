import mongoose from "mongoose";

const PayoutSchema = new mongoose.Schema({
  owner: String,
  account: String,
  company: String,
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
  wallet: String,
});

PayoutSchema.methods.PaymentRequestDone = async function (data) {
  try {
    this.owner = data.owner;
    this.account = data.account;
    this.company = data.company;
    this.amount = data.amount;
    this.status = "Pending";
    this.createdDate = Date.now();
    this.wallet = data.wallet;

    await this.save();
  } catch (error) {
    console.error("Error in PaymentRequestDone method:", error);
    throw error;
  }
};

PayoutSchema.methods.PayoutDone = async function (amount) {
  try {
    this.acceptedDate = Date.now();
    this.amount = amount;
    this.status = "Accepted";

    await this.save();
  } catch (error) {
    console.error("Error in PaymentRequestDone method:", error);
    throw error;
  }
};

PayoutSchema.methods.RejectPayout = async function () {
  try {
    this.acceptedDate = Date.now();
    this.status = "Rejected";

    await this.save();
  } catch (error) {
    console.error("Error in PaymentRequestDone method:", error);
    throw error;
  }
};

const Payout = mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);

export default Payout;
