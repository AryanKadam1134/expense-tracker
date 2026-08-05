import { model, Schema } from "mongoose";

const reminderSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    openingDue: {
      type: Number,
      required: true,
    },
    currentDue: Number,
    dueDate: Date,
    isPaid: Boolean,
    repeat: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
  },
  { timestamps: true },
);

export const Reminder = model("Reminder", reminderSchema);
