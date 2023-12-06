import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    trim: true,
    unique: true,
  },
  comment: String,
  company: {
    type: String,
    enum: ["Funding Pips", "FTMO", "Funded Next", "The Funded Trader", "True Forex Funds", "My Forex Funds"],
  },
  image: String,
  target: Number,
  dailyDrawdown: Number,
  overallDrawdown: Number,
  phase: Number,
  capital: Number,
  balance: Number,
  status: {
    type: String,
    enum: ["Live", "Lost", "Review", "Upgrade", "Upgraded", "Payout", "Payment", "Requested", "Registration", "Rejected"],
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
  userActionRequired: Boolean,
  adminActionRequired: Boolean,
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
  dates: {
    createdDate: Date,
    registrationDate: Date,
    firstTradeDate: Date,
    lastTradeDate: Date,
    targetReachedDate: Date,
    upgradeDate: Date,
    upgradedDate: Date,
    paymentDate: Date,
    lostDate: Date,
  },
  minimumTrades: Number,
  tradesExecuted: Number,
  previousAccount: String,
  nextAccount: String,
  deletedFromUser: Boolean,
});

AccountSchema.pre("save", function (next) {
  try {
    if (this.isNew) {
      if (this.phase === 1) {
        const newActivity = {
          title: "Account Requested",
          description: "Account requested",
        };
        this.activity.push(newActivity);
        this.comment = "Await the completion of the funds transfer to your wallet";
        this.number = (Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111).toString();
        this.status = "Requested";
        this.dates.createdDate = Date.now();
        this.userActionRequired = false;
        this.adminActionRequired = true;
      }

      // Όταν κάνει upgrade (όταν δηλαδή αλλάζει το phase) θα πρέπει να δίνω
      // number
      // στο api θα παίρνει το company, capital του προηγούμενου account και θα τα βάζει στο νέο και το προηγούμενο account number στο previousAccount
      // ----------- στο προηγούμενο θα βάζει upgradedDate
      if (this.phase === 2) {
        const newActivity = {
          title: "Account Created",
          description: "Account upgraded from challenge to evaluation",
        };
        this.commnet = "Account is Live";
        this.activity.push(newActivity);
        this.status = "Live";
        this.dates.createdDate = Date.now();
        this.userActionRequired = true;
        this.adminActionRequired = false;
        this.target = GetEconomicRules(this).target;
        this.dailyDrawdown = GetEconomicRules(this).dailyDrawdown;
        this.overallDrawdown = GetEconomicRules(this).overallDrawdown;
        this.balance = this.capital;
      }

      // Όταν κάνει upgrade θα πρέπει να δίνει
      // number
      // στο api θα παίρνει το company, capital του προηγούμενου account και θα τα βάζει στο νέο και το προηγούμενο account number στο previousAccount
      // ----------- στο προηγούμενο θα βάζει upgradedDate
      if (this.phase === 3) {
        const newActivity = {
          title: "Account Created",
          description: "Account upgraded from evaluation to funded",
        };
        this.activity.push(newActivity);
        this.commnet = "Account is Live";
        this.status = "Live";
        this.dates.createdDate = Date.now();
        this.userActionRequired = true;
        this.adminActionRequired = false;
        this.target = GetEconomicRules(this).target;
        this.dailyDrawdown = GetEconomicRules(this).dailyDrawdown;
        this.overallDrawdown = GetEconomicRules(this).overallDrawdown;
        this.balance = this.capital;
      }

      this.image = GetImage(this.company);
    } else {
      // Αν η εταιρία αλλάξει θα πρέπει να αλλάξει και η εικόνα της
      if (this.isModified("company")) {
        this.image = GetImage(this.company);
      }

      // Αν αλλάξει το balance θα πρέπει να γίνουν ελέγχοι

      if (this.isModified("balance")) {
        if (this.company === "Funding Pips") {
          if (this.balance >= this.target) {
            if (this.phase === 1 || this.phase === 2) {
              const newActivity = {
                title: `${this.phase === 1 ? "Evaluation" : "Verification"} phase passed`,
                description: `${this.phase === 1 ? "Evaluation" : "Verification"} phase passed in ${this.number} account.`,
              };
              this.activity.push(newActivity);
              this.status = "Upgrade";
              this.userActionRequired = true;
              this.dates.upgradeDate = GetUpgradeDate(this);
              this.targetReachedDate = Date.now();
              this.comment = `Well done! You pass your ${this.phase === 1 ? "evaluation" : "verification"} phase! You can upgrade your account at ${new Date(this.dates.upgradeDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
            }

            if (this.phase === 3) {
              const newActivity = {
                title: "Profit goal reached",
                description: `Account ${this.number} gain profits of $${this.balance - this.capital}`,
              };
              this.activity.push(newActivity);
              this.status = "Payment";
              this.targetReachedDate = Date.now();
              this.dates.paymentDate = GetPaymentDate(this);
              this.userActionRequired = true;
              this.comment = `Congratulations! You've reached a profit of $${this.balance - this.capital}`;
            }
          }

          if (this.balance <= this.overallDrawdown) {
            this.status = "Review";
            this.dates.lostDate = Date.now();
            this.comment = `You lost your account with number ${this.number}. You can now delete it.`;
          }
        }
      }

      // Ρύθμιση user και admin ActionRequired
      if (this.isModified("userActionRequired")) {
        this.adminActionRequired = !this.userActionRequired;
      }
      if (this.isModified("adminActionRequired")) {
        this.userActionRequired = !this.adminActionRequired;
      }
    }
  } catch (error) {
    console.error("Error in pre save method:", error);
    throw error;
  }
  next();
});

AccountSchema.methods.FundsTransferred = async function (data) {
  try {
    const newActivity = {
      title: "Funds Transferred",
      description: `The administrator has transferred $${data.amount} to ${data.wallet} for the acquisition of a ${this.company} account with a capital of $${this.capital}.`,
    };
    this.activity.push(newActivity);
    this.company = data.company;
    this.comment = `The amount of $${data.amount} have been successfully transferred to your wallet. Proceed with the account acquisition from ${this.company} with an amount of $${data.capital}, and upon completion, return to declare the account number.`;
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

    this.target = GetEconomicRules(this).target;
    this.dailyDrawdown = GetEconomicRules(this).dailyDrawdown;
    this.overallDrawdown = GetEconomicRules(this).overallDrawdown;

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
    this.comment = "You are now ready to execute your first transaction";
    this.userActionRequired = true;

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

AccountSchema.methods.RejectAccount = async function (comment) {
  try {
    this.comment = comment;
    this.status = "Rejected";
    this.userActionRequired = true;
    const newActivity = {
      title: "Account Rejected",
      description: `Account rejected. ${comment}`,
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

function GetEconomicRules(account) {
  let target;
  let dailyDrawdown;
  let overallDrawdown;

  if (account.company === "Funding Pips") {
    if (account.phase === 1) {
      target = account.capital * 1.08;
    }
    if (account.phase === 2) {
      target = account.capital * 1.05;
    }
    dailyDrawdown = account.capital * 0.96;
    overallDrawdown = account.capital * 0.9;
  }

  if (account.phase === 3) {
    target = account.capital * 1.03;
  }

  return { target, dailyDrawdown, overallDrawdown };
}

function GetUpgradeDate(account) {
  if (account.company === "Funding Pips") {
    return Date.now();
  }
}

function GetPaymentDate(account) {
  if (account.company === "Funding Pips") {
    const firstTradeDate = new Date(account.dates.firstTradeDate);
    return firstTradeDate.getDate() + 5;
  }
}

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
