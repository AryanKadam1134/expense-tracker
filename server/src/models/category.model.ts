import { Schema, model, Types, HydratedDocument } from "mongoose";

interface CategoryFields {
  ownerId: Types.ObjectId;
  name: string;
}

const categorySchema = new Schema<CategoryFields>(
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

export const Category = model<CategoryFields>("Category", categorySchema);

export type CategoryDocument = HydratedDocument<CategoryFields>;
