import { model, Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      required: true,
      enum: ["credit", "debit"],
    },
    date: Date,
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

export const Transaction = model("Transaction", transactionSchema);
