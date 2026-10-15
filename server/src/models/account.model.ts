import { Schema, model, Types, HydratedDocument } from "mongoose";

import { ACCOUNT_TYPES } from "../contants";

interface AccountFields {
  ownerId: Types.ObjectId;
  bankId: Types.ObjectId;
  name: string;
  accountNumber?: string | null;
  accountType?: string | null;
  openingBalance: number;
  currentBalance: number;
}

const accountSchema = new Schema<AccountFields>(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankId: {
      type: Types.ObjectId,
      ref: "Bank",
      required: true,
    },
    name: {
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
