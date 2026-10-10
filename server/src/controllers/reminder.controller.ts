import mongoose from "mongoose";

import { Reminder } from "../models/reminder.model";
import { Transaction } from "../models/transaction.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

import { revertAccountChangesAndDeleteTransaction } from "./transaction.controller";

const addReminder = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { title, description, openingDue, dueDate, repeat } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  if (!openingDue) {
    throw new ApiError(400, "Opening due is required!");
  }

  if (!dueDate) {
    throw new ApiError(400, "Due date is required!");
  }

  const reminderExists = await Reminder.findOne({
    owner: loggedUserId,
    title,
  });

  if (reminderExists) {
    throw new ApiError(400, "Title already exists!");
  }

  const fields: {
    title: string;
    description?: string;
    openingDue: number;
    currentDue: number;
    dueDate: Date;
    repeat?: string;
  } = {
    title,
    openingDue,
    currentDue: openingDue,
    dueDate,
  };

  if (description) fields.description = description;
  if (repeat) fields.repeat = repeat;

  const createReminder = await Reminder.create({
    owner: loggedUserId,
    ...fields,
  });

  return res
    .status(200)
    .json(new ApiRes(200, createReminder, "Reminder added!"));
});

const updateReminder = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const reminder = req.reminder;

  if (!reminder) {
    throw new ApiError(404, "Reminder not found!");
  }

  const { title, description, dueDate, repeat } = req.body;

  if (title) {
    const reminderTitleExists = await Reminder.findOne({
      _id: { $nc: reminder?._id },
      owner: loggedUserId,
      title,
    });

    if (reminderTitleExists) {
      throw new ApiError(400, "Reminder title already exists!");
    }
  }

  const fields: Partial<
    Pick<typeof reminder, "title" | "description" | "dueDate" | "repeat">
  > = {};

  if (title) fields.title = title;
  if (dueDate) fields.dueDate = dueDate;
  if (repeat) fields.repeat = repeat;

  if (description !== undefined) fields.description = description;

  Object.assign(reminder, fields);

  const updatedReminder = await reminder.save();

  return res
    .status(200)
    .json(new ApiRes(200, updatedReminder, "Reminder updated!"));
});

const deleteReminder = asynchandler(async (req, res) => {
  const reminder = req.reminder;

  if (!reminder) {
    throw new ApiError(404, "Reminder not found!");
  }

  const transactions = await Transaction.find({
    reminder: reminder?._id,
  });

  if (transactions?.length > 0) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        for (const transaction of transactions) {
          await revertAccountChangesAndDeleteTransaction(transaction, session);
        }

        await reminder.deleteOne({ session });
      });
    } finally {
      await session.endSession();
    }
  } else {
    await reminder.deleteOne();
  }

  return res.status(200).json(new ApiRes(200, {}, "Reminder deleted!"));
});

const getReminder = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.reminder, "Reminder fetched!"));
});

const getReminders = asynchandler(async (req, res) => {
  const reminders = await Reminder.find({
    owner: req.user?._id,
  });

  if (reminders?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, reminders, "No reminders found!"));
  }

  return res.status(200).json(new ApiRes(200, reminders, "Reminders fetched!"));
});

export {
  addReminder,
  updateReminder,
  deleteReminder,
  getReminder,
  getReminders,
};
