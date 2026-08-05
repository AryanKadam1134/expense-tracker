import { Schema, model } from "mongoose";

const accountSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankName: {
      type: String,
      required: true,
      index: true,
    },
    accountName: {
      type: String,
      required: true,
      index: true,
    },
    accountNumber: String,
    accountType: {
      type: String,
      enum: ["current", "salary", "savings", "other"],
    },
    openingBalance: {
      type: Number,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Account = model("Account", accountSchema);
