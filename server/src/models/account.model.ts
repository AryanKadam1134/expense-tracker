import { Schema, model } from "mongoose";
import { ACCOUNT_TYPES } from "../contants";

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
      enum: ACCOUNT_TYPES.map((a) => a.value),
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
