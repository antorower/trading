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

const Trade = mongoose.models.Trade || mongoose.model("Trade", TradeSchema);

export default Trade;
