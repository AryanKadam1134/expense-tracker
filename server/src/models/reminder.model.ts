import { Schema, model, Types, HydratedDocument } from "mongoose";

import { REMINDERS } from "../contants";

interface ReminderFields {
  owner: Types.ObjectId;
  title: string;
  description?: string | null;
  openingDue: number;
  currentDue: number;
  dueDate: Date;
  isPaid?: boolean | null;
  repeat?: string | null;
}

const reminderSchema = new Schema<ReminderFields>(
  {
    owner: {
      type: Types.ObjectId,
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
    isPaid: {
      typr: Boolean,
      default: false,
    },
    repeat: {
      type: String,
      enum: REMINDERS.map((r) => r.value),
    },
  },
  { timestamps: true },
);

export const Reminder = model<ReminderFields>("Reminder", reminderSchema);

export type ReminderDocument = HydratedDocument<ReminderFields>;
