import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    companies: [
      {
        name: String,
        active: {
          type: Boolean,
          default: false,
        },
        phases: Number,
        refundableFee: {
          exist: {
            type: Boolean,
            default: false,
          },
          when: String,
        },
        extraRules: [
          {
            name: String,
            description: String,
          },
        ],
        phase1: {
          tradingPeriod: String,
          minimumTradingDays: String,
          maximumDailyLoss: Number,
          maximumLoss: Number,
          profitTarget: Number,
        },
        phase2: {
          tradingPeriod: String,
          minimumTradingDays: String,
          maximumDailyLoss: Number,
          maximumLoss: Number,
          profitTarget: Number,
        },
        funded: {
          maximumDailyLoss: Number,
          maximumLoss: Number,
          firstPayment: String,
          paymentCycle: String,
        },
        trustpilotLink: String,
      },
    ],
    schedule: {
      datesSchedule: String,
      monday: {
        pairs: [String],
        deadline: String,
        lotsFactor: Number,
        activeDay: Boolean,
      },
      tuesday: {
        pairs: [String],
        deadline: String,
        lotsFactor: Number,
        activeDay: Boolean,
      },
      wednesday: {
        pairs: [String],
        deadline: String,
        lotsFactor: Number,
        activeDay: Boolean,
      },
      thursday: {
        pairs: [String],
        deadline: String,
        lotsFactor: Number,
        activeDay: Boolean,
      },
      friday: {
        pairs: [String],
        deadline: String,
        lotsFactor: Number,
        activeDay: Boolean,
      },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;
