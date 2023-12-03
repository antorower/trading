import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: String,
  comment: {
    type: String,
    default: "Await the completion of the funds transfer to your wallet",
  },
  company: {
    type: String,
    enum: ["Funding Pips", "FTMO", "Funded Next", "The Funded Trader", "True Forex Funds", "My Forex Funds"],
  },
  target: {
    percentage: Number,
    amount: Number,
  },
  dailyDrawdown: {
    percentage: Number,
    amount: Number,
  },
  overallDrawdown: {
    percentage: Number,
    amount: Number,
  },
  number: {
    type: String,
    trim: true,
    unique: true,
  },
  phase: {
    type: Number,
    required: true,
    default: 1,
  },
  capital: Number,
  balance: Number,
  status: {
    type: String,
    enum: ["Live", "Lost", "Review", "Upgrade", "Payout", "Payment", "Requested", "Registration", "Rejected"],
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
  userActionRequired: {
    type: Boolean,
    default: false,
  },
  adminActionRequired: {
    type: Boolean,
    default: true,
  },
  action: String,
  activity: [
    {
      activityDate: {
        type: Date,
        default: Date.now,
      },
      title: String,
      description: String,
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastTrade: Date,
  phase1Account: {
    number: String,
    createdDate: Date,
    passDate: Date,
  },
  phase2Account: {
    number: String,
    createdDate: Date,
    passDate: Date,
  },
  deletedFromUser: Boolean,
  deletedFromAdmin: Boolean,
});

AccountSchema.pre("save", function (next) {
  if (this.isNew) {
    const newActivity = {
      title: "Account Requested",
      description: `Account requested by ${this.username}`,
    };
    this.activity.push(newActivity);
    this.number = (Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111).toString();
  }

  if (this.isModified("company")) {
    if (this.company === "Funding Pips") {
      this.image = "fundingpips";
    }
  }

  next();
});

AccountSchema.methods.FundsTransferred = async function (data) {
  try {
    this.company = data.company;
    this.comment = "";
    this.action = `The amount of $${data.amount} have been successfully transferred to your wallet. Proceed with the account acquisition from ${this.company} with an amount of $${data.capital}, and upon completion, return to declare the account number.`;
    this.capital = data.capital;
    this.balance = data.capital;
    this.status = "Registration";
    this.moneyTransfered = true;
    this.moneyTransferDetails = {
      transferDate: Date.now(),
      transferWallet: data.wallet,
      transferAmount: data.amount,
    };
    this.userActionRequired = true;
    this.adminActionRequired = false;

    if (this.company === "Funding Pips") {
      this.target.percentage = 0.04;
      this.target.amount = this.capital * (1 + this.target.percentage);
      this.dailyDrawdown.percentage = 0.04;
      this.dailyDrawdown.amount = this.capital * (1 - this.dailyDrawdown.percentage);
      this.overallDrawdown.percentage = 0.1;
      this.overallDrawdown.amount = this.capital * (1 - this.overallDrawdown.percentage);
    }

    const newActivity = {
      title: "Funds Transferred",
      description: `The administrator has transferred $${data.amount} to ${data.wallet} for the acquisition of a ${this.company} account with a capital of $${this.capital}.`,
    };
    this.activity.push(newActivity);
    await this.save();
  } catch (error) {
    console.error("Error in fundsTransferred method:", error);
    throw error;
  }
};

AccountSchema.methods.RegisterAccount = async function (data) {
  try {
    this.number = data.number;
    this.status = "Live";

    const newActivity = {
      title: "Account Number Updated",
      description: `Account number has been updated to ${data.number}.`,
    };

    this.activity.push(newActivity);

    await this.save();
  } catch (error) {
    console.error("Error in registerAccount method:", error);
    throw error;
  }
};

AccountSchema.methods.UpdateBalance = async function (data) {
  try {
    if (data.balance >= this.target.amount) {
    } else if (data.balance <= this.overallDrawdown.amount) {
    } else {
      this.balance = data.balance;
    }
    await this.save();
  } catch (error) {
    console.error("Error in updateBalance method:", error);
    throw error;
  }
};

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
