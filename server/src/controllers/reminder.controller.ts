import mongoose from "mongoose";

import { Reminder } from "../models/reminder.model";
import { Transaction } from "../models/transaction.model";

import { revertAccountChangesAndDeleteTransaction } from "./transaction.controller";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";
import { paginateQuery } from "../utils/pagination";

const addReminder = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { title, description, originalDue, dueDate, frequency } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  if (!originalDue) {
    throw new ApiError(400, "Opening due is required!");
  }

  if (!dueDate) {
    throw new ApiError(400, "Due date is required!");
  }

  const reminderExists = await Reminder.findOne({
    ownerId: loggedUserId,
    title,
  });

  if (reminderExists) {
    throw new ApiError(400, "Title already exists!");
  }

  const fields: {
    title: string;
    description?: string;
    originalDue: number;
    remainingDue: number;
    dueDate: Date;
    frequency?: string;
  } = {
    title,
    originalDue,
    remainingDue: originalDue,
    dueDate,
  };

  if (description) fields.description = description;
  if (frequency) fields.frequency = frequency;

  const createReminder = await Reminder.create({
    ownerId: loggedUserId,
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

  const { title, description, dueDate, frequency } = req.body;

  if (title) {
    const reminderTitleExists = await Reminder.findOne({
      _id: { $ne: reminder?._id },
      ownerId: loggedUserId,
      title,
    });

    if (reminderTitleExists) {
      throw new ApiError(400, "Reminder title already exists!");
    }
  }

  const fields: Partial<
    Pick<typeof reminder, "title" | "description" | "dueDate" | "frequency">
  > = {};

  if (title) fields.title = title;
  if (dueDate) fields.dueDate = dueDate;
  if (frequency) fields.frequency = frequency;

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
    reminderId: reminder?._id,
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
  const { page, limit } = req.query;
  const parsedPage = typeof page === "string" ? Number(page) : undefined;
  const parsedLimit = typeof limit === "string" ? Number(limit) : undefined;

  const reminders = await paginateQuery({
    model: Reminder,
    filter: { ownerId: req.user?._id },
    page: parsedPage,
    limit: parsedLimit,
  });

  if (reminders.data.length === 0) {
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
