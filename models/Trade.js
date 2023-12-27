import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  userId: String,
  account: String,
  company: String,
  startingBalance: Number,
  endingBalance: Number,
  pair: String,
  lots: Number,
  position: {
    type: String,
    enum: ["Buy", "Sell"],
  },
  status: {
    type: String,
    enum: ["Open", "Close"],
    default: "Open",
  },
  openAt: {
    type: Date,
    default: Date.now,
  },
  closeAt: Date,
  stopLoss: Number,
  takeProfit: Number,
  fake: {
    type: Boolean,
    default: false,
  },
});

TradeSchema.methods.CloseTrade = async function (balance) {
  try {
    this.endingBalance = balance;
    this.status = "Close";
    await this.save();
  } catch (error) {
    console.error("Error in CloseTrade method:", error);
    throw error;
  }
};

const Trade = mongoose.models.Trade || mongoose.model("Trade", TradeSchema);

export default Trade;
