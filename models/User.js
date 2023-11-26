import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    mentor: String,
    role: {
      type: String,
      enum: ["admin", "leader", "trader"],
      required: true,
      default: "trader",
    },
    collaborators: [String],
    propFirmsWallet: {
      type: String,
      unique: true,
      trim: true,
    },
    walletSecretPhrase: {
      type: String,
      trim: true,
    },
    personalWallet: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
