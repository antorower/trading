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
    enum: ["Funding Pips"],
  },
  image: String,
  capital: Number,
  target: Number,
  dailyDrawdown: Number,
  overallDrawdown: Number,
  phase: Number,
  paid: {
    type: Boolean,
    default: false,
  },
  balance: Number,
  status: {
    type: String,
    enum: ["Live", "Lost", "Review", "Upgrade", "Upgraded", "Payout", "Payment", "Requested", "Registration", "Rejected"],
    // Requested: Ο χρήστης έχει αιτηθεί νέο account και εγώ πρέπει να στείλω τα λεφτά
    // Rejected: Ο χρήστης έχει αιτηθεί νέο account αλλά εγώ το απέρριψα
    // Registration: Έχω στείλει τα λεφτά και περιμένω ο νέος χρήστης να κάνει εγγραφή το account του
    // Live: Πρέπει να μπεί trade σε αυτό το account
    // Upgrade: Ο χρήστης πρέπει κάποια στιγμή, τώρα ή στο μέλλον, να κάνει upgrade το account του
    // Upgraded: Το account έχει γίνει upgrade
    // Payment: Ο χρήστης πρέπει κάποια στιγμή, τώρα ή στο μέλλον, να κάνει payment request
    // Payout: Ο χρήστης έχει κάνει payment request και περιμένουμε τα λεφτά να μπουν στο wallet
    // Review: Το account έχασε και εγώ πρέπει να το ελέγξω
    // Lost: Το account έχει ελεγχθεί και "αρχειοθετείται"
  },
  tradesExecuted: {
    type: Number,
    default: 0,
  },
  deletedFromUser: {
    type: Boolean,
    default: false,
  },
  moneyTransferDetails: {
    transferred: Boolean,
    transferDate: Date,
    transferWallet: String,
    transferAmount: Number,
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
  openTrade: {
    pending: {
      type: Boolean,
      default: false,
    },
    fake: Boolean,
    pair: String,
    position: String,
    lots: Number,
  },
  // Μετά το 3
  registrationDate: Date,
  // Όταν ανοίγει το πρώτο trade
  firstTradeDate: Date,
  // Κάθε φορά που ανοίγει ένα trade
  lastTradeOpenDate: Date,
  // Κάθε φορά που κλείνει ένα trade
  lastTradeCloseDate: Date,
  // Κάθε φορά που κλείνει ένα trade ελέγχεται αν έπιασε τον στόχο, αν ναι αποθηκεύει την ημερομηνία
  targetReachedDate: Date,
  // Όταν κλείνει ένα trade και έχει πιάσει τον στόχο και επίσης έχει καλύψει και τα απαιτούμενα trades τότε θα αποθηκεύει εδώ την ημέρα του upgrade
  upgradeDate: Date,
  // Η μέρα που έγινε το upgrade
  upgradedDate: Date,
  // Όταν κλείνει ένα trade και έχει πιάσει τον στόχο και τα απαιτούμενα trades τότε αποθηκεύει εδώ την ημέρα πληρωμής
  paymentDate: Date,
  // Ποιά μέρα έκανε payment request
  paymentedDate: Date,
  // Όταν κλείνει ένα trade και έχει πέσει κάτω από το overall dd τότε αποθηκεύει εδώ την ημερομηνία
  lostDate: Date,
  lostByDailyDrawdown: {
    type: Boolean,
    default: false,
  },
  // Όταν γίνει ένα upgrade ένα account κάνω update και το παλιό και το νέο με το next και previous
  chain: {
    previousAccount: String,
    nextAccount: String,
  },
});

AccountSchema.pre("save", function (next) {
  if (this.isModified("company")) {
    this.image = GetImage(this.company);
  }

  if (this.isModified("openTrade.pending")) {
    if (!this.openTrade.pending) {
      this.openTrade.pair = "";
      this.openTrade.position = "";
      this.openTrade.fake = false;
    }
  }

  if ((this.isModified("company") || this.isModified("phase") || this.isModified("capital")) && this.company && this.phase && this.capital) {
    const economicRules = GetEconomicRules(this);
    this.target = economicRules.target;
    this.dailyDrawdown = economicRules.dailyDrawdown;
    this.overallDrawdown = economicRules.overallDrawdown;
  }

  next();
});
// Ο trader ζήτησε account
AccountSchema.methods.RequestAccount = async function ({ userId, company }) {
  try {
    this.userId = userId;
    const newActivity = {
      title: "Account Requested",
      description: `The user request an account`,
    };
    this.activity.push(newActivity);
    this.number = GenerateRandomString(30);
    this.comment = "Please await the transfer of funds to your wallet";
    this.phase = 1;
    this.status = "Requested";
    this.moneyTransferDetails.transferred = false;
    this.company = company;

    await this.save();
  } catch (error) {
    console.error("Error in RequestAccount method inside Account model:", error);
    throw error;
  }
};
// Εγώ έστειλα τα λεφτά
AccountSchema.methods.FundsTransferred = async function (data) {
  try {
    const newActivity = {
      title: "Funds Transferred",
      description: `The administrator has transferred $${data.amount} to ${data.wallet} for the acquisition of a ${this.company} account with a capital of $${this.capital}`,
    };
    this.activity.push(newActivity);
    this.company = data.company;
    this.comment = `The amount of $${data.amount} have been successfully transferred to your wallet. Proceed with the account acquisition from ${this.company} with an amount of $${data.capital}, and upon completion, return to declare the account number`;
    this.capital = data.capital;
    this.balance = data.capital;
    this.status = "Registration";
    this.moneyTransferDetails = {
      transferred: true,
      transferDate: Date.now(),
      transferWallet: data.wallet,
      transferAmount: data.amount,
    };

    await this.save();
  } catch (error) {
    console.error("Error in FundsTransferred method:", error);
    throw error;
  }
};
// Ο trader δήλωσε τον αριθμό του account
AccountSchema.methods.RegisterAccount = async function (number) {
  try {
    const newActivity = {
      title: "Account Number Updated",
      description: `Account number has been updated to ${number}.`,
    };
    this.activity.push(newActivity);

    this.number = number;
    this.status = "Live";
    this.comment = "You are now ready to execute your first transaction";
    this.registrationDate = Date.now();

    await this.save();
  } catch (error) {
    console.error("Error in RegisterAccount method:", error);
    throw error;
  }
};
// Εγώ έκανα reject το account request του user
AccountSchema.methods.RejectAccount = async function (comment) {
  try {
    const newActivity = {
      title: "Account Rejected",
      description: `Requested account rejected: ${comment}`,
    };
    this.activity.push(newActivity);
    this.comment = `Your request for new account rejected. ${comment}`;
    this.status = "Rejected";
    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Ο trader ανοίγει trade
AccountSchema.methods.OpenTrade = async function (trade, fake) {
  try {
    const newActivity = {
      title: "Trade Opened",
      description: fake ? "A fake trade has been opened. Please close it" : `A ${trade.position} position has been opened for ${trade.pair}`,
    };
    this.activity.push(newActivity);

    this.comment = fake ? "A fake trade has been opened. Please close it now." : "An open trade is currently active. Please ensure its closure before 22:00.";

    if (!this.firstTradeDate) {
      this.firstTradeDate = Date.now();
    }

    this.lastTradeOpenDate = Date.now();
    this.tradesExecuted += 1;

    this.openTrade.pending = true;
    if (fake) {
      this.openTrade.fake = true;
    } else {
      this.openTrade.pair = trade.pair;
      this.openTrade.position = trade.position;
      this.openTrade.lots = trade.lots;
      this.openTrade.fake = false;
    }

    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Ο trader κλείνει trade
AccountSchema.methods.CloseTrade = async function (balance) {
  try {
    const newActivity = {
      title: "Trade Closed",
      description: this.openTrade.fake ? "Fake trade has been closed" : `A ${this.openTrade.position} position on ${this.openTrade.pair} has been closed.`,
    };
    this.activity.push(newActivity);
    this.openTrade.pending = false;

    if (this.balance - balance >= this.dailyDrawdown) {
      this.comment = "Hey trader, your account has been closed. No worries! You can always request a new one.";
      this.lostByDailyDrawdown = true;
      this.status = "Review";
      this.lostDate = Date.now();
    } else if (balance <= this.overallDrawdown) {
      this.comment = "Hey trader, your account has been closed. No worries! You can always request a new one.";
      this.lostByDailyDrawdown = false;
      this.status = "Review";
      this.lostDate = Date.now();
    }

    if (balance >= this.target && this.balance < this.target) {
      if (this.company === "Funding Pips") {
        if (this.phase === 1) {
          const newActivity = {
            title: "Evaluation Passed",
            description: "Evaluation phase passed and trader is ready to upgrade the account",
          };
          this.activity.push(newActivity);

          this.comment = "Congratulations! You have pass the evaluation phase. You can now upgrade your account.";
          this.status = "Upgrade";
          this.targetReachedDate = Date.now();
          this.upgradeDate = Date.now();
        }
        if (this.phase === 2) {
          const newActivity = {
            title: "Verification Passed",
            description: "Verification phase passed and trader is ready to upgrade the account",
          };
          this.activity.push(newActivity);

          this.comment = "Congratulations! You have pass the verification phase. You can now upgrade your account.";
          this.status = "Upgrade";
          this.targetReachedDate = Date.now();
          this.upgradeDate = Date.now();
        }
        if (this.phase === 3) {
          const newActivity = {
            title: "Profit target reached!",
            description: "Verification phase passed and trader is ready to upgrade the account",
          };
          this.activity.push(newActivity);

          this.comment = "Congratulations! You have reach the profit target.";
          this.status = "Payment";
          this.targetReachedDate = Date.now();

          // Add 4 days
          let paymentDateTemp = new Date(this.firstTradeDate.getTime() + 345600000);
          // Set the hour to 12 at night
          paymentDateTemp.setHours(0, 0, 0, 0);
          // Return the date to miliseconds format - At front end i will check the paymentDate and i will customize the comment and the action dot
          this.paymentDate = paymentDateTemp.getTime();
        }
      }
    }

    this.balance = balance;
    this.lastTradeCloseDate = Date.now();

    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Ο trader κάνει upgrade το account
AccountSchema.methods.UpgradeAccount = async function (prevAccount, newNumber) {
  try {
    const newActivity = {
      title: "Account Upgraded",
      description: `${prevAccount.company} account ${prevAccount.number} upgraded and now ${newNumber} is live at phase ${prevAccount.phase + 1}`,
    };
    this.activity.push(newActivity);
    this.comment = `${newNumber} is now live. Upgraded from ${prevAccount.number}.`;
    this.company = prevAccount.company;
    this.capital = prevAccount.capital;
    this.phase = prevAccount.phase + 1;
    this.balance = prevAccount.capital;
    this.status = "Live";
    this.createdDate = Date.now();
    this.tradesExecuted = 0;
    this.prevAccount = prevAccount.number;
    this.openTrade.pending = false;

    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Ο trader κάνει payment request
AccountSchema.methods.PaymentAccount = async function (wallet) {
  try {
    const newActivity = {
      title: "Payment Request Done",
      description: `Payment request done with profits ${this.balance - this.capital} at wallet ${wallet}`,
    };
    this.activity.push(newActivity);
    this.paymentedDate = Date.now();
    this.status = "Payout";
    this.comment = "Your payment request has been submitted. Please await the completion of the payout process before executing any further trades.";

    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Φτάνουν τα χρήματα στο wallet της ομάδας
AccountSchema.methods.PayoutAccount = async function (profit, wallet) {
  try {
    const newActivity = {
      title: "Payout Complete",
      description: `Payout process complete and the profit of ${profit} has been added to the wallet ${wallet}`,
    };
    this.activity.push(newActivity);
    this.comment = "Your account is ready for your next trades.";
    this.balance = this.capital;
    this.status = "Live";
    this.paid = true;
    this.firstTradeDate = null;
    this.lastTradeOpenDate = null;
    this.lastTradeCloseDate = null;
    this.targetReachedDate = null;
    this.paymentDate = null;
    this.paymentedDate = null;

    await this.save();
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Επιστρέφει αν επιτρέπονται τα trades
AccountSchema.methods.CheckIfTradeAllowed = async function () {
  try {
    if (this.status != "Live") return false;
    if (this.balance >= this.target) return false;
    return true;
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Επιστρέφει το take profit
AccountSchema.methods.GetTakeProfit = async function (lots) {
  try {
    const remainingProfit = this.target - this.balance;
    const remainingPercentage = remainingProfit / this.capital;
    if (this.phase === 1) {
      if (remainingPercentage < 0.035) {
        return remainingProfit + 5 * lots;
      } else if (remainingPercentage >= 0.035 && remainingPercentage <= 0.045) {
        return this.capital * Math.random() * (0.028 - 0.02) + 0.02;
      } else {
        return this.capital * Math.random() * (0.04 - 0.03) + 0.03;
      }
    }

    if (this.phase === 2) {
      if (remainingPercentage <= 0.05) {
        return remainingProfit + 5 * lots;
      } else if (remainingPercentage >= 0.035 && remainingPercentage <= 0.045) {
        return this.capital * Math.random() * (0.028 - 0.02) + 0.02;
      } else {
        return this.capital * Math.random() * (0.04 - 0.03) + 0.03;
      }
    }

    if (this.phase === 3) {
      if (remainingPercentage <= 0.04) {
        return remainingProfit + 5 * lots;
      } else {
        return this.capital * Math.random() * (0.04 - 0.03) + 0.03;
      }
    }
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};

// Επιστρέφει το stop loss
AccountSchema.methods.GetStopLoss = async function () {
  try {
    const remainingLoss = this.balance - this.overallDrawdown;
    const remainingPercentage = remainingLoss / this.capital;

    if (remainingPercentage < 0.04) {
      return remainingLoss + 5 * lots;
    } else {
      return this.capital * Math.random() * (0.04 - 0.034) + 0.034;
    }
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

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  if (account.company === "Funding Pips") {
    if (account.phase === 1) {
      target = account.capital * 1.08;
    }
    if (account.phase === 2) {
      target = account.capital * 1.05;
    }
    dailyDrawdown = account.capital * 0.05;
    overallDrawdown = account.capital * 0.9;
  }
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  if (account.phase === 3) {
    target = account.capital * 1.03;
  }

  return { target, dailyDrawdown, overallDrawdown };
}

function GenerateRandomString(stringLength) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  var charactersLength = characters.length;
  for (var i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
