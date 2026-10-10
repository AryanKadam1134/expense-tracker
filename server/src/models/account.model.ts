import { Schema, model, Types, HydratedDocument } from "mongoose";

import { ACCOUNT_TYPES } from "../contants";

interface AccountFields {
  owner: Types.ObjectId;
  bankName: string;
  accountName: string;
  accountNumber?: string | null;
  accountType?: string | null;
  openingBalance: number;
  currentBalance: number;
}

const accountSchema = new Schema<AccountFields>(
  {
    owner: {
      type: Types.ObjectId,
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

export const Account = model<AccountFields>("Account", accountSchema);

export type AccountDocument = HydratedDocument<AccountFields>;
