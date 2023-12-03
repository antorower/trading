import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    schedule: {
      development: {
        type: Boolean,
        default: true,
      },
      datesSchedule: {
        startDay: {
          type: String,
          default: "1",
          trim: true,
        },
        startMonth: {
          type: String,
          default: "1",
          trim: true,
        },
        endDay: {
          type: String,
          default: "1",
          trim: true,
        },
        endMonth: {
          type: String,
          default: "1",
          trim: true,
        },
      },
      monday: {
        pairs: {
          type: [String],
          default: ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "GBPNZD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"],
        },
        rejectedTraders: {
          type: [{}],
          default: [{}],
        },
        startingTradingHour: {
          type: Number,
          default: 0,
        },
        endingTradingHour: {
          type: Number,
          default: 0,
        },
        lotsFactor: {
          type: Number,
          default: 1,
        },
        activeDay: {
          type: Boolean,
          default: false,
        },
      },
      tuesday: {
        pairs: {
          type: [String],
          default: ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "GBPNZD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"],
        },
        rejectedTraders: {
          type: [{}],
          default: [{}],
        },
        startingTradingHour: {
          type: Number,
          default: 0,
        },
        endingTradingHour: {
          type: Number,
          default: 0,
        },
        lotsFactor: {
          type: Number,
          default: 1,
        },
        activeDay: {
          type: Boolean,
          default: false,
        },
      },
      wednesday: {
        pairs: {
          type: [String],
          default: ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "GBPNZD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"],
        },
        rejectedTraders: {
          type: [{}],
          default: [{}],
        },
        startingTradingHour: {
          type: Number,
          default: 0,
        },
        endingTradingHour: {
          type: Number,
          default: 0,
        },
        lotsFactor: {
          type: Number,
          default: 1,
        },
        activeDay: {
          type: Boolean,
          default: false,
        },
      },
      thursday: {
        pairs: {
          type: [String],
          default: ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "GBPNZD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"],
        },
        rejectedTraders: {
          type: [{}],
          default: [{}],
        },
        startingTradingHour: {
          type: Number,
          default: 0,
        },
        endingTradingHour: {
          type: Number,
          default: 0,
        },
        lotsFactor: {
          type: Number,
          default: 1,
        },
        activeDay: {
          type: Boolean,
          default: false,
        },
      },
      friday: {
        pairs: {
          type: [String],
          default: ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "GBPNZD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"],
        },
        rejectedTraders: {
          type: [{}],
          default: [{}],
        },
        startingTradingHour: {
          type: Number,
          default: 0,
        },
        endingTradingHour: {
          type: Number,
          default: 0,
        },
        lotsFactor: {
          type: Number,
          default: 1,
        },
        activeDay: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  { timestamps: true }
);

SettingsSchema.methods.ResetSchedule = async function (data) {
  try {
    const pairs = ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "GBPNZD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"];

    this.development = true;

    this.schedule.datesSchedule.startDay = data.startDay;
    this.schedule.datesSchedule.endDay = data.endDay;
    this.schedule.datesSchedule.startMonth = data.startMonth;
    this.schedule.datesSchedule.endMonth = data.endMonth;

    this.schedule.monday.pairs = pairs;
    this.schedule.monday.activeDay = false;
    this.schedule.monday.lotsFactor = 1;
    this.schedule.monday.startingTradingHour = 0;
    this.schedule.monday.endingTradingHour = 0;
    this.schedule.monday.rejectedTraders = [];

    this.schedule.tuesday.pairs = pairs;
    this.schedule.tuesday.activeDay = false;
    this.schedule.tuesday.lotsFactor = 1;
    this.schedule.tuesday.startingTradingHour = 0;
    this.schedule.tuesday.endingTradingHour = 0;
    this.schedule.tuesday.rejectedTraders = [];

    this.schedule.wednesday.pairs = pairs;
    this.schedule.wednesday.activeDay = false;
    this.schedule.wednesday.lotsFactor = 1;
    this.schedule.wednesday.startingTradingHour = 0;
    this.schedule.wednesday.endingTradingHour = 0;
    this.schedule.wednesday.rejectedTraders = [];

    this.schedule.thursday.pairs = pairs;
    this.schedule.thursday.activeDay = false;
    this.schedule.thursday.lotsFactor = 1;
    this.schedule.thursday.startingTradingHour = 0;
    this.schedule.thursday.endingTradingHour = 0;
    this.schedule.thursday.rejectedTraders = [];

    this.schedule.friday.pairs = pairs;
    this.schedule.friday.activeDay = false;
    this.schedule.friday.lotsFactor = 1;
    this.schedule.friday.startingTradingHour = 0;
    this.schedule.friday.endingTradingHour = 0;
    this.schedule.friday.rejectedTraders = [];

    await this.save();
  } catch (error) {
    console.error("Error in reset schedule method:", error);
    throw error;
  }
};

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;

function GenerateRandomId(stringLength) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  var charactersLength = characters.length;
  for (var i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
