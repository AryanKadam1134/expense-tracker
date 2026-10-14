import { Schema, model, Types, HydratedDocument } from "mongoose";

interface BankFields {
  owner: Types.ObjectId;
  name: string;
}

const bankSchema = new Schema<BankFields>(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Bank = model<BankFields>("Bank", bankSchema);

export type BankDocument = HydratedDocument<BankFields>;
