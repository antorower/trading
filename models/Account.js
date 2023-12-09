import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  // 1. Τυχαίο νούμερο 3. Δηλώνει το πραγματικό number
  number: {
    type: String,
    trim: true,
    unique: true,
  },
  comment: String,
  // 1. Διαλέγει εταιρία 2. Ορίζω εγώ την εταιρία
  company: {
    type: String,
    enum: ["Funding Pips"],
  },
  profile: {
    // 2. Ορίζω εγώ το κεφάλαιο
    capital: Number,
    // Όταν η company κάνει modify θα αλλάζει κα η εικόνα
    image: String,
  },
  state: {
    // Όταν η company ή το phase αλλάζει τότε αλλάζουν και τα target και ddd, odd
    target: Number,
    dailyDrawdown: Number,
    overallDrawdown: Number,
    // Το phase αλλάζει όταν ο χρήστης κάνει upgrade
    phase: Number,
    // Το balance αλλάζει μόνο στο close trade
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
    // Αφού το account γίνει Review ή Lost εμφανίζεται η επιλογή στον χρήστη αν το διαγράψει (να μην του εμφανίζεται δηλαδή)
    deletedFromUser: Boolean,
    // Μετά την πρώτη πληρωμή αυτό γίνεται true
    paid: {
      type: Boolean,
      default: false,
    },
  },
  // 2. Μόλις στείλω τα λεφτά αλλάζω και αυτά
  moneyTransferDetails: {
    transfered: Boolean,
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
  dates: {
    createdDate: Date.now,
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
    // Όταν κλείνει ένα trade και έχει πέσει κάτω από το overall dd τότε αποθηκεύει εδώ την ημερομηνία
    lostDate: Date,
  },
  // Κάθε φορά που ανοίγει ένα trade αυτό αυξάνεται κατά 1
  tradesExecuted: {
    type: Number,
    default: 0,
  },
  userActionRequired: Boolean,
  adminActionRequired: Boolean,
  // Όταν γίνει ένα upgrade ένα account κάνω update και το παλιό και το νέο με το next και previous
  chain: {
    previousAccount: String,
    nextAccount: String,
  },
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
        this.tradesExecuted = 0;
      }

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

              if (this.company === "Funding Pips") {
                this.minimumDays = 0;
                this.minimumTrades = 0;
              }
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
              if (this.company === "Funding Pips") {
                this.minimumDays = 5;
                this.minimumTrades = 0;
              }
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

  try {
    if (this.isNew) {
    } else {
      if (this.isModified("company")) {
        this.image = GetImage(this.company);
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

    if (data.company === "Funding Pips") {
      this.minimumTrades = 0;
      this.minimumDays = 0;
    }

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

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  if (account.phase === 3) {
    target = account.capital * 1.03;
  }

  return { target, dailyDrawdown, overallDrawdown };
}

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
