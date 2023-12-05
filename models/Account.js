import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: "Await the completion of the funds transfer to your wallet",
  },
  action: String,
  company: {
    type: String,
    enum: ["Funding Pips", "FTMO", "Funded Next", "The Funded Trader", "True Forex Funds", "My Forex Funds"],
  },
  image: String,
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
});

AccountSchema.pre("save", function (next) {
  if (this.isNew) {
    const newActivity = {
      title: "Account Requested",
      description: "Account requested",
    };
    this.activity.push(newActivity);
    this.number = (Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111).toString();
    this.image = GetImage(this.company);
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
    this.image = GetImage(this.company);
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

AccountSchema.methods.RegisterAccount = async function (number) {
  try {
    this.number = number;
    this.status = "Live";
    this.comment = "";
    this.action = "You are now ready to execute your first transaction";

    const newActivity = {
      title: "Account Number Updated",
      description: `Account number has been updated to ${number}.`,
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

AccountSchema.methods.RejectAccount = async function (comment) {
  try {
    this.comment = comment;
    this.status = "Rejected";
    this.userActionRequired = true;
    this.adminActionRequired = false;
    const newActivity = {
      title: "Account Rejected",
      description: `Account rejected: ${comment}`,
    };
    this.activity.push(newActivity);
    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};

function GetImage(company) {
  if (company === "Funding Pips") {
    return "fundingpips";
  } else {
    return "placeholder";
  }
}

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
