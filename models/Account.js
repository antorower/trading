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
    enum: ["Funding Pips", "Alpha Capital"],
  },
  image: String,
  capital: Number,
  target: Number,
  dailyDrawdown: Number,
  overallDrawdown: Number,
  phase: Number,
  paidTimes: {
    type: Number,
    default: 0,
  },
  balance: Number,
  balanceMismatch: {
    type: Boolean,
    default: false,
  },
  needTrade: {
    type: Boolean,
    default: true,
  },
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
  minimumTradingDays: Number,
  minimumWaitingDays: Number,
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
    takeProfit: Number,
    stopLoss: Number,
  },
  registrationDate: Date,
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
  rejectedDate: Date,
  lostByDailyDrawdown: Boolean,
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

    if (this.company === "Funding Pips") {
      this.minimumTradingDays = 0;
      if (this.phase === 1 || this.phase === 2) {
        this.minimumWaitingDays = 0;
      } else if (this.phase === 3) {
        this.minimumWaitingDays = 7;
      }
    }

    if (this.company === "Alpha Capital") {
      if (this.phase === 1 || this.phase === 2) {
        this.minimumWaitingDays = 3;
        this.minimumTradingDays = 3;
      } else if (this.phase === 3) {
        this.minimumWaitingDays = 14;
        this.minimumTradingDays = 5;
      }
    }
    // #NewCompany
  }
  next();
});
// Ο trader ζήτησε account
AccountSchema.methods.RequestAccount = async function ({ userId, company }) {
  try {
    this.userId = userId;
    this.number = GenerateRandomString(30);
    this.comment = "Please wait for the funds to be transferred to your wallet";
    this.company = company;
    this.phase = 1;
    this.status = "Requested";
    const newActivity = {
      title: "Account Requested",
      description: `The user request an account`,
    };
    this.activity.push(newActivity);
    this.moneyTransferDetails.transferred = false;

    await this.save();
  } catch (error) {
    console.error("Error in RequestAccount method inside Account model:", error);
    throw error;
  }
};
// Εγώ έστειλα τα λεφτά
AccountSchema.methods.FundsTransferred = async function (data) {
  try {
    this.comment = `Funds of $${data.amount} sent. Proceed with ${this.company} account purchase for $${data.capital} and provide account number.`;
    this.company = data.company;
    this.capital = data.capital;
    this.balance = data.capital;
    this.status = "Registration";
    this.moneyTransferDetails = {
      transferred: true,
      transferDate: Date.now(),
      transferWallet: data.wallet,
      transferAmount: data.amount,
    };
    const newActivity = {
      title: "Funds Transferred",
      description: `The administrator has transferred $${data.amount} to ${data.wallet} for the acquisition of a ${this.company} account with a capital of $${this.capital}`,
    };
    this.activity.push(newActivity);

    await this.save();
  } catch (error) {
    console.error("Error in FundsTransferred method:", error);
    throw error;
  }
};
// Ο trader δήλωσε τον αριθμό του account
AccountSchema.methods.RegisterAccount = async function (number) {
  try {
    this.number = number;
    this.comment = "You are now ready to execute your first transaction";
    this.status = "Live";
    this.registrationDate = Date.now();
    const newActivity = {
      title: "Account Number Updated",
      description: `Account number has been updated to ${number}.`,
    };
    this.activity.push(newActivity);

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

// Ο trader κάνει upgrade το account (αυτό είναι για το νέο account)
AccountSchema.methods.UpgradeNewAccount = async function (prevAccount, newNumber) {
  try {
    this.userId = prevAccount.userId;
    this.number = newNumber;
    this.comment = `${newNumber} upgraded from ${prevAccount.number} and is ready for the first transaction`;
    this.company = prevAccount.company;
    this.capital = prevAccount.capital;
    this.phase = prevAccount.phase + 1;
    this.balance = prevAccount.capital;
    this.status = "Live";
    this.createdDate = Date.now();
    this.tradesExecuted = 0;
    this.chain.prevAccount = prevAccount.number;
    this.openTrade.pending = false;

    const newActivity = {
      title: "Account Upgraded",
      description: `${prevAccount.company} account ${prevAccount.number} upgraded and now ${newNumber} is live at phase ${prevAccount.phase + 1}`,
    };
    this.activity.push(newActivity);

    await this.save();
  } catch (error) {
    console.error("Error in UpgradeAccount method:", error);
    throw error;
  }
};
// Ο trader κάνει upgrade το account (αυτό είναι για το παλιό account)
AccountSchema.methods.UpgradeOldAccount = async function (newNumber) {
  try {
    this.status = "Upgraded";
    const newActivity = {
      title: "Account Upgraded",
      description: `Account upgraded to ${newNumber} at phase ${this.phase + 1}`,
    };
    this.activity.push(newActivity);
    this.upgradedDate = Date.now();
    this.comment = `${this.number} upgraded to ${newNumber}`;
    this.chain.nextAccount = newNumber;

    await this.save();
  } catch (error) {
    console.error("Error in UpgradeAccount method:", error);
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
    this.comment = "Please await the completion of the payout process before executing any further trades.";
    this.paymentedDate = Date.now();
    this.status = "Payout";
    this.needTrade = false;
    await this.save();
  } catch (error) {
    console.error("Error in PaymentAccount method:", error);
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
    this.comment = "Your account is now live ready to execute transactions";
    this.needTrade = true;
    this.tradesExecuted = 0;
    this.openTrade.pending = false;
    this.paidTimes = this.paidTimes + 1;
    this.balance = this.capital;
    this.status = "Live";
    this.firstTradeDate = null;
    await this.save();
  } catch (error) {
    console.error("Error in PayoutAccount method:", error);
    throw error;
  }
};

// Ο trader ανοίγει trade
AccountSchema.methods.OpenTrade = async function (trade) {
  try {
    this.comment = trade.fake ? "A fake trade has been opened. Please close it now." : "An open trade is currently active. Please ensure its closure before 22:00.";
    const newActivity = {
      title: "Trade Opened",
      description: trade.fake ? "A fake trade has been opened. Please close it" : `A ${trade.position} position has been opened for ${trade.pair}`,
    };
    this.activity.push(newActivity);

    this.openTrade.takeProfit = trade.takeProfit;
    this.openTrade.stopLoss = trade.stopLoss;

    this.openTrade.pending = true;
    this.openTrade.fake = trade.fake;
    if (!trade.fake) {
      this.openTrade.pair = trade.pair;
      this.openTrade.position = trade.position;
      this.openTrade.lots = trade.lots;
    }

    if (!this.firstTradeDate) {
      this.firstTradeDate = Date.now();
    }
    this.lastTradeOpenDate = Date.now();

    await this.save();
  } catch (error) {
    console.error("Error in OpenTrade method:", error);
    throw error;
  }
};
// Ο trader κλείνει trade
AccountSchema.methods.CloseTrade = async function (balance) {
  try {
    const startingDate = this.firstTradeDate;
    startingDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const difference = currentDate - startingDate;
    const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

    const newActivity = {
      title: "Trade Closed",
      description: this.openTrade.fake ? `Fake trade has been closed with balance ${balance}` : `A ${this.openTrade.position} position on ${this.openTrade.pair} has been closed with balance ${balance}`,
    };
    this.activity.push(newActivity);
    this.lastTradeCloseDate = Date.now();
    this.openTrade.pending = false;
    this.tradesExecuted = this.tradesExecuted + 1;

    if (this.balance - balance >= this.dailyDrawdown) {
      this.comment = "Hey diligent trader, your account has been closed. No worries! You can always request a new one, always for free!";
      this.lostByDailyDrawdown = true;
      this.status = "Review";
      this.lostDate = Date.now();
      const newActivity = {
        title: "Account lost",
        description: "Account lost by daily drawdown",
      };
      this.activity.push(newActivity);
    } else if (balance <= this.overallDrawdown) {
      this.comment = "Hey trader, your account has been closed. No worries! You can always request a new one.";
      this.lostByDailyDrawdown = false;
      this.status = "Review";
      this.lostDate = Date.now();
      const newActivity = {
        title: "Account lost",
        description: "Account lost by overall drawdown",
      };
      this.activity.push(newActivity);
    }

    // Αν το account έχει πιάσει τον στόχο
    let finalTarget = this.target;
    if (this.phase === 3) {
      finalTarget = this.target * 0.99;
    }
    if (balance >= finalTarget) {
      // Αν πρώτη φορά σε αυτό το trade έπιασε τον στόχο κάνω update το targetReachDate
      if (this.balance < this.target) {
        const newActivity = {
          title: "Target Reached",
          description: `Target reached with balance ${balance}`,
        };
        this.activity.push(newActivity);
        this.targetReachedDate = Date.now();
      }

      // Αν έχει βάλει όλα τα trades
      if (this.tradesExecuted >= this.minimumTradingDays) {
        this.needTrade = false;
        if (this.phase === 1 || this.phase === 2) {
          this.status = "Upgrade";
          if (daysPassed >= this.minimumWaitingDays) {
            this.comment = `You reach the target and you can now upgrade your account`;
            this.upgradeDate = Date.now();
          } else {
            const remainingDays = this.minimumWaitingDays - daysPassed;
            const actionDate = new Date();
            actionDate.setHours(0, 0, 0, 0);
            actionDate.setDate(currentDate.getDate() + remainingDays);
            this.comment = `You reach the target and you can upgrade your account at ${new Date(actionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
          }
        } else if (this.phase === 3) {
          this.status = "Payment";
          if (daysPassed >= this.minimumWaitingDays) {
            this.comment = `You reach the target and you can now make payment request`;
            this.paymentDate = Date.now();
          } else {
            const remainingDays = this.minimumWaitingDays - daysPassed;
            const actionDate = new Date();
            actionDate.setHours(0, 0, 0, 0);
            actionDate.setDate(currentDate.getDate() + remainingDays);
            this.paymentDate = actionDate;
            this.comment = `You reach the target and you can make payout request at ${new Date(actionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
          }
        }
      } else {
        this.needTrade = true;
        const remainingTrades = this.minimumTradingDays - tradesExecuted;
        this.comment = `Congrats! You reach the target, ${remainingTrades} fake trade${remainingTrades > 1 ? "s" : null} remaining`;
      }
    } else {
      if (this.status === "Live") {
        this.needTrade = true;
        this.comment = "Your account is live";
      }
    }
    this.balance = balance;
    await this.save();
  } catch (error) {
    console.error("Error in CloseTrade method:", error);
    throw error;
  }
};

// Επιστρέφει το take profit
AccountSchema.methods.GetTakeProfit = async function (lots) {
  try {
    const remainingProfit = this.target - this.balance;
    const remainingPercentage = remainingProfit / this.capital;

    if (this.phase === 1) {
      if (remainingPercentage < 0.045) {
        return Math.floor(remainingProfit + 10 * lots);
      } else {
        return Math.floor(this.capital * (Math.random() * (0.04 - 0.03) + 0.03));
      }
    }

    /*
    if (this.phase === 1) {
      if (remainingPercentage < 0.035) {
        return Math.floor(remainingProfit + 5 * lots);
      } else if (remainingPercentage >= 0.035 && remainingPercentage <= 0.045) {
        return Math.floor(this.capital * (Math.random() * (0.028 - 0.02) + 0.02));
      } else {
        return Math.floor(this.capital * (Math.random() * (0.04 - 0.03) + 0.03));
      }
    }
    */

    if (this.phase === 2) {
      if (remainingPercentage <= 0.05) {
        return remainingProfit + 10 * lots;
      } else if (remainingPercentage >= 0.035 && remainingPercentage <= 0.045) {
        return this.capital * (Math.random() * (0.028 - 0.02) + 0.02);
      } else {
        return this.capital * (Math.random() * (0.04 - 0.03) + 0.03);
      }
    }

    if (this.phase === 3) {
      if (remainingPercentage <= 0.03) {
        return remainingProfit;
      } else {
        return this.capital * (Math.random() * (0.04 - 0.03) + 0.03);
      }
    }
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};
// Επιστρέφει το stop loss
AccountSchema.methods.GetStopLoss = async function (lots) {
  try {
    const remainingLoss = this.balance - this.overallDrawdown;

    if (remainingLoss < this.dailyDrawdown) {
      return remainingLoss + 7 * lots;
    } else {
      return Math.floor(this.dailyDrawdown * (0.85 + Math.random() * 0.15) * 0.75);
    }
  } catch (error) {
    console.error("Error in RejectAccount method:", error);
    throw error;
  }
};

function GetImage(company) {
  if (company === "Funding Pips") {
    return "fundingpips";
  }
  if (company === "Alpha Capital") {
    return "alphacapital";
  }
  // #NewCompany

  // #TASK -> Να αποθηκεύσω μια εικόνα σαν placeholder.svg
  return "placeholder";
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

    if (account.phase === 3) {
      target = account.capital * 1.03;
    }

    dailyDrawdown = account.capital * 0.05;
    overallDrawdown = account.capital * 0.9;
  }

  if (account.company === "Alpha Capital") {
    if (account.phase === 1) {
      target = account.capital * 1.08;
    }

    if (account.phase === 2) {
      target = account.capital * 1.05;
    }

    if (account.phase === 3) {
      target = account.capital * 1.03;
    }

    dailyDrawdown = account.capital * 0.05;
    overallDrawdown = account.capital * 0.9;
  }
  // #NewCompany

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

/*
if (this.phase === 1 || this.phase === 2) {
  this.status = "Upgrade";

  if (daysPassed >= this.minimumWaitingDays) {
    if (this.phase === 1 || this.phase === 2) {
      this.comment = `You reach the target and you can upgrade your account now`;
      this.upgradeDate = Date.now();
    } else if (this.phase === 3) {
      this.comment = `You reach the target and you can now make payment request`;
      this.paymentDate = Date.now();
    }
  } else {
    const remainingDays = this.minimumWaitingDays - daysPassed;
    const actionDate = new Date();
    actionDate.setHours(0, 0, 0, 0);
    actionDate.setDate(currentDate.getDate() + remainingDays);
    if (this.phase === 1 || this.phase === 2) {
      this.comment = `You reach the target and you can upgrade your account at ${new Date(actionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
    } else if (this.phase === 3) {
      this.comment = `You reach the target and you can make payout request at ${new Date(actionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
    }
  }
} else if (this.phase === 3) {
  this.status === "Payment";

  if (daysPassed >= this.minimumWaitingDays) {
    if (this.phase === 1 || this.phase === 2) {
      this.comment = `You reach the target and you can upgrade your account now`;
      this.upgradeDate = Date.now();
    } else if (this.phase === 3) {
      this.comment = `You reach the target and you can now make payment request`;
      this.paymentDate = Date.now();
    }
  } else {
    const remainingDays = this.minimumWaitingDays - daysPassed;
    const actionDate = new Date();
    actionDate.setHours(0, 0, 0, 0);
    actionDate.setDate(currentDate.getDate() + remainingDays);
    if (this.phase === 1 || this.phase === 2) {
      this.comment = `You reach the target and you can upgrade your account at ${new Date(actionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
    } else if (this.phase === 3) {
      this.comment = `You reach the target and you can make payout request at ${new Date(actionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
    }
  }
}



      // Αν αυτό είναι το trade που έπιασε τον στόχο
      if (this.balance < this.target) {
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
      } else {
        // Αν τον στόχο τον έπιασε σε προηγούμενο trade
}
      

*/
