import mongoose from "mongoose";

const UserPaymentSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  wallet: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserPayment = mongoose.models.UserPayment || mongoose.model("UserPayment", UserPaymentSchema);

export default UserPayment;
