import { model, Schema } from "mongoose";

import { REMINDERS } from "../contants";

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
      enum: REMINDERS.map((r) => r.value),
    },
  },
  { timestamps: true },
);

export const Reminder = model("Reminder", reminderSchema);
