import { Schema, model, Types, HydratedDocument } from "mongoose";

import { REMINDERS } from "../contants";

interface ReminderFields {
  ownerId: Types.ObjectId;
  title: string;
  description?: string | null;
  originalDue: number;
  remainingDue: number;
  dueDate: Date;
  isPaid?: boolean | null;
  frequency?: string | null;
}

const reminderSchema = new Schema<ReminderFields>(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    originalDue: {
      type: Number,
      required: true,
    },
    remainingDue: Number,
    dueDate: Date,
    isPaid: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: REMINDERS.map((r) => r.value),
    },
  },
  { timestamps: true },
);

export const Reminder = model<ReminderFields>("Reminder", reminderSchema);

export type ReminderDocument = HydratedDocument<ReminderFields>;
