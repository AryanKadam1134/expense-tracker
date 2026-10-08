import { Schema, model, Types, type HydratedDocument } from "mongoose";

import { TRANSACTION_TYPES } from "../contants";

interface TransactionFields {
  owner: Types.ObjectId;
  account: Types.ObjectId;
  title: string;
  description?: string | null;
  type?: string | null;
  date: Date;
  category: Types.ObjectId | null;
  amount: number;
  transferId?: number | null;
  note?: string | null;
}

const transactionSchema = new Schema<TransactionFields>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES.map((t) => t.value),
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    amount: {
      type: Number,
      required: true,
    },
    transferId: String,
    note: String,
  },
  { timestamps: true },
);

export const Transaction = model<TransactionFields>(
  "Transaction",
  transactionSchema,
);

export type TransactionDocument = HydratedDocument<TransactionFields>;
