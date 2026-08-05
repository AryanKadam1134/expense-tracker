import { model, Schema } from "mongoose";

const categorySchema = new Schema(
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

export const Category = model("Category", categorySchema);
