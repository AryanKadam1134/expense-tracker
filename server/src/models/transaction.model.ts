import { Schema, model, Types, HydratedDocument } from "mongoose";

import { TRANSACTION_TYPES } from "../contants";

interface TransactionFields {
  ownerId: Types.ObjectId;
  accountId: Types.ObjectId;
  title: string;
  description?: string | null;
  type: string;
  date: Date;
  categoryId?: Types.ObjectId | null;
  amount: number;
  reminderId?: Types.ObjectId | null;
  transferId?: string | null;
  note?: string | null;
}

const transactionSchema = new Schema<TransactionFields>(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: Types.ObjectId,
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
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
    },
    amount: {
      type: Number,
      required: true,
    },
    reminderId: {
      type: Types.ObjectId,
      ref: "Reminder",
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
