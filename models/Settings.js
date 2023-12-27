import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
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
  lots: {
    EURUSD: { type: Number, default: 2.2 },
    USDJPY: { type: Number, default: 2.8 },
    GBPUSD: { type: Number, default: 1.3 },
    AUDUSD: { type: Number, default: 2.3 },
    USDCAD: { type: Number, default: 2.1 },
    USDCHF: { type: Number, default: 1.8 },
    NZDUSD: { type: Number, default: 2.3 },
    EURGBP: { type: Number, default: 2.1 },
    EURJPY: { type: Number, default: 2.3 },
    EURAUD: { type: Number, default: 2.1 },
    EURCAD: { type: Number, default: 2.1 },
    EURCHF: { type: Number, default: 2.7 },
    EURNZD: { type: Number, default: 1.9 },
    GBPJPY: { type: Number, default: 1.8 },
    GBPAUD: { type: Number, default: 1.7 },
    GBPCAD: { type: Number, default: 1.8 },
    GBPCHF: { type: Number, default: 1.6 },
    GBPNZD: { type: Number, default: 1.8 },
    AUDJPY: { type: Number, default: 2.6 },
    AUDCAD: { type: Number, default: 2.9 },
    AUDCHF: { type: Number, default: 2.3 },
    AUDNZD: { type: Number, default: 1.9 },
    CADJPY: { type: Number, default: 2.7 },
    CADCHF: { type: Number, default: 2.3 },
    NZDJPY: { type: Number, default: 2.1 },
    NZDCAD: { type: Number, default: 1.9 },
    NZDCHF: { type: Number, default: 2.1 },
    CHFJPY: { type: Number, default: 2.5 },
  },
  plan: {
    monday: {
      fundingPips: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
      ftmo: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
    },
    tuesday: {
      fundingPips: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
      ftmo: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
    },
    wednesday: {
      fundingPips: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
      ftmo: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
    },
    thursday: {
      fundingPips: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
      ftmo: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
    },
    friday: {
      fundingPips: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
      ftmo: {
        currentId: {
          type: Number,
          default: 0,
        },
        list: [{}],
      },
    },
  },
  economic: {
    dates: {
      startDate: Date,
      endDate: Date,
    },
    shares: {
      fundingPips: {
        leader: Number,
        traders: Number,
      },
    },
  },
});

SettingsSchema.pre("save", function (next) {
  if (this.isModified("schedule.monday.pairs")) {
    const randomIndex = Math.floor(Math.random() * this.schedule.monday.pairs.length);
    UpdatePlan(this, "monday", randomIndex);
  }

  if (this.isModified("schedule.tuesday.pairs")) {
    const randomIndex = Math.floor(Math.random() * this.schedule.tuesday.pairs.length);
    UpdatePlan(this, "tuesday", randomIndex);
  }

  if (this.isModified("schedule.wednesday.pairs")) {
    const randomIndex = Math.floor(Math.random() * this.schedule.wednesday.pairs.length);
    UpdatePlan(this, "wednesday", randomIndex);
  }

  if (this.isModified("schedule.thursday.pairs")) {
    const randomIndex = Math.floor(Math.random() * this.schedule.thursday.pairs.length);
    UpdatePlan(this, "thursday", randomIndex);
  }

  if (this.isModified("schedule.friday.pairs")) {
    const randomIndex = Math.floor(Math.random() * this.schedule.friday.pairs.length);
    UpdatePlan(this, "friday", randomIndex);
  }
  next();
});

function UpdatePlan(settings, day, startingIndex) {
  try {
    settings.plan[day].fundingPips.list = settings.schedule[day].pairs.map((pair, index) => ({
      id: index + 1,
      pair: pair,
      lastPosition: Math.random() < 0.5 ? "Buy" : "Sell",
      lastLots: settings.lots[pair],
    }));
    settings.plan[day].fundingPips.currentId = startingIndex;

    settings.plan[day].ftmo.list = settings.schedule[day].pairs.map((pair, index) => ({
      id: index + 1,
      pair: pair,
      lastPosition: settings.plan[day].fundingPips === "Buy" ? "Sell" : "Buy",
      lastLots: settings.lots[pair],
    }));
    settings.plan[day].ftmo.currentId = startingIndex;
  } catch (error) {
    console.error("Error in reset schedule method:", error);
    throw error;
  }
}

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
    this.schedule.monday.pairs = [];

    this.schedule.tuesday.pairs = pairs;
    this.schedule.tuesday.activeDay = false;
    this.schedule.tuesday.lotsFactor = 1;
    this.schedule.tuesday.startingTradingHour = 0;
    this.schedule.tuesday.endingTradingHour = 0;
    this.schedule.tuesday.pairs = [];

    this.schedule.wednesday.pairs = pairs;
    this.schedule.wednesday.activeDay = false;
    this.schedule.wednesday.lotsFactor = 1;
    this.schedule.wednesday.startingTradingHour = 0;
    this.schedule.wednesday.endingTradingHour = 0;
    this.schedule.wednesday.pairs = [];

    this.schedule.thursday.pairs = pairs;
    this.schedule.thursday.activeDay = false;
    this.schedule.thursday.lotsFactor = 1;
    this.schedule.thursday.startingTradingHour = 0;
    this.schedule.thursday.endingTradingHour = 0;
    this.schedule.thursday.pairs = [];

    this.schedule.friday.pairs = pairs;
    this.schedule.friday.activeDay = false;
    this.schedule.friday.lotsFactor = 1;
    this.schedule.friday.startingTradingHour = 0;
    this.schedule.friday.endingTradingHour = 0;
    this.schedule.friday.pairs = [];

    await this.save();
  } catch (error) {
    console.error("Error in reset schedule method:", error);
    throw error;
  }
};

SettingsSchema.methods.OpenTrade = async function (day, company, index, lots) {
  console.log(day);
  console.log(company);
  console.log(index);
  console.log(lots);

  try {
    const listLength = this.plan[day][company].list.length;
    console.log("List Lenght", listLength);
    if (index === listLength - 1) {
      this.plan[day][company].currentId = 0;
    } else {
      this.plan[day][company].currentId = index + 1;
    }

    if (this.plan[day][company].list[index].lastPosition === "Buy") {
      this.plan[day][company].list[index].lastPosition = "Sell";
    } else {
      this.plan[day][company].list[index].lastPosition = "Buy";
    }

    this.plan[day][company].list[index].lastLots = lots;
    await this.save();
  } catch (error) {
    console.error("Error in reset schedule method:", error);
    throw error;
  }
};

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;
