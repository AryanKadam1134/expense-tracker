import { HydratedDocument, model, Schema, Types } from "mongoose";

interface CategoryFields {
  owner: Types.ObjectId;
  name: string;
}

const categorySchema = new Schema<CategoryFields>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
