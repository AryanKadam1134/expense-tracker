import { Schema, model, Types, HydratedDocument } from "mongoose";

interface BankFields {
  ownerId: Types.ObjectId;
  name: string;
}

const bankSchema = new Schema<BankFields>(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
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
