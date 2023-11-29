import mongoose from "mongoose";

const AppErrorSchema = new mongoose.Schema(
  {
    user: {},
    errorMessage: String,
    errorsObject: {},
    file: String,
    location: String,
    solved: {
      type: Boolean,
      default: false,
    },
    statusCode: Number,
  },
  { timestamps: true }
);

const AppError = mongoose.models.AppError || mongoose.model("AppError", AppErrorSchema);

export default AppError;
