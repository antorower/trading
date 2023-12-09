import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: String,
  minTrades: {
    challenge: Number,
    verification: Number,
    funded: {
      firstPayment: Number,
      afterFirstPayment: Number,
    },
  },
  minDays: {
    challenge: Number,
    verification: Number,
    funded: {
      firstPayment: Number,
      afterFistPayment: Number,
    },
  },
  target: {
    challenge: Number,
    verification: Number,
    funded: Number,
  },
  dailyDrawdown: Number,
  overallDrawdown: Number,
  active: Boolean,
  image: String,
  kyc: [String],
});

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
