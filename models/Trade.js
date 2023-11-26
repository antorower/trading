import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      index: true,
    },
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
      trim: true,
    },
    openAt: Date,
    closeAt: Date,
    stoploss: Number,
    takeProfit: Number,
  },
  { timestamps: true }
);

const Trade = mongoose.models.Trade || mongoose.model("Trade", TradeSchema);

export default Trade;
