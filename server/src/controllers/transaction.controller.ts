import mongoose, { ClientSession, Types } from "mongoose";

import { Account } from "../models/account.model";
import { Category } from "../models/category.model";
import { Reminder } from "../models/reminder.model";
import { Transaction, TransactionDocument } from "../models/transaction.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

import { TRANSACTION_TYPES } from "../contants";

const addCategory = async (
  category: Types.ObjectId | string,
  loggedUserId: Types.ObjectId,
  session: ClientSession,
) => {
  if (!category) return null;

  try {
    if (typeof category !== "string") {
      throw new ApiError(400, "Enter a valid category!");
    }

    const categoryValue = category.trim();
    const categoryFilter = Types.ObjectId.isValid(categoryValue)
      ? { _id: new Types.ObjectId(categoryValue) }
      : { name: categoryValue };

    let categoryExists = await Category.findOne({
      ...categoryFilter,
      ownerId: loggedUserId,
    }).session(session);

    if (!categoryExists && !("_id" in categoryFilter)) {
      [categoryExists] = await Category.create(
        [{ ownerId: loggedUserId, name: categoryValue }],
        { session },
      );
    }

    if (!categoryExists) {
      throw new ApiError(404, "Category not found!");
    }

    return categoryExists._id;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    }

    throw new ApiError(500, "Error creating category!");
  }
};

const revertAccountChangesAndDeleteTransaction = async (
  transaction: TransactionDocument,
  session: ClientSession,
  {
    restoreAccountBalance = true,
    restoreReminderDue = false,
  }: { restoreAccountBalance?: boolean; restoreReminderDue?: boolean } = {},
) => {
  try {
    const { type, amount } = transaction;

    if (restoreAccountBalance) {
      const account = await Account.findById(transaction.accountId).session(
        session,
      );

      if (!account) {
        throw new ApiError(404, "Account not found!");
      }

      if (type === "credit" && account.currentBalance < amount) {
        throw new ApiError(
          400,
          "Not sufficient balance available to delete a credited transaction!",
        );
      }

      if (type === "credit") {
        account.currentBalance -= amount;
      } else if (type === "debit") {
        account.currentBalance += amount;
      }

      await account.save({ session });
    }

    if (restoreReminderDue && type === "debit" && transaction.reminderId) {
      const reminder = await Reminder.findById(transaction.reminderId).session(
        session,
      );

      if (!reminder) {
        throw new ApiError(404, "Reminder not found!");
      }

      if (
        reminder.originalDue < amount ||
        reminder.originalDue < reminder.remainingDue + amount
      ) {
        throw new ApiError(400, "Restored due exceeds the opening due amount!");
      }

      await Reminder.updateOne(
        { _id: reminder._id },
        {
          $inc: { remainingDue: amount },
          $set: { isPaid: false },
        },
        { session },
      );
    }

    await transaction.deleteOne({ session });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    }

    throw new ApiError(500, "Error deleting transaction!");
  }
};

const addTransaction = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  if (!loggedUserId) {
    throw new ApiError(401, "Authentication required!");
  }

  const {
    accountId,
    title,
    description,
    type,
    date,
    categoryId,
    amount,
    reminderId,
    note,
  } = req.body;

  // --- check if account exists --- //
  if (!accountId) {
    throw new ApiError(400, "Account is required!");
  }

  // --- check required fields --- //
  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  if (!type) {
    throw new ApiError(400, "Account type is required!");
  }

  if (!TRANSACTION_TYPES.map((t) => t.value).includes(type)) {
    throw new ApiError(400, "Enter a valid Transaction type!");
  }

  if (!date) {
    throw new ApiError(400, "Date is required!");
  }

  if (!amount) {
    throw new ApiError(400, "Amount is required!");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new ApiError(400, "Enter a valid amount!");
  }
  // --- check required fields --- //

  // --- assign fields --- //
  const fields: {
    title: string;
    accountId: Types.ObjectId;
    type: string;
    date: Date;
    amount: number;
    description?: string;
    categoryId?: Types.ObjectId | null;
    reminderId?: Types.ObjectId | null;
    note?: string;
  } = {
    title,
    accountId,
    type,
    date,
    amount,
  };

  if (description) fields.description = description;
  if (note) fields.note = note;
  // --- assign fields --- //

  // Create the optional category, transaction, and balance change atomically.
  const session = await mongoose.startSession();
  let createTransaction: InstanceType<typeof Transaction> | undefined;

  try {
    await session.withTransaction(async () => {
      const accountExists = await Account.findOne({
        ownerId: loggedUserId,
        _id: accountId,
      }).session(session);

      if (!accountExists) {
        throw new ApiError(404, "Account not found!");
      }

      if (type === "debit" && reminderId) {
        const reminderExists = await Reminder.findOne({
          ownerId: loggedUserId,
          _id: reminderId,
        }).session(session);

        if (!reminderExists) {
          throw new ApiError(404, "Reminder not found!");
        }

        if (reminderExists.remainingDue < amount) {
          throw new ApiError(400, "Amount is greater than the due amount!");
        }

        await Reminder.updateOne(
          { _id: reminderExists._id },
          {
            $inc: { remainingDue: -amount },
            $set: {
              isPaid: reminderExists.remainingDue === amount ? true : false,
            },
          },
          { session },
        );

        fields.reminderId = reminderExists._id;
      } else if (type === "credit" && reminderId) {
        throw new ApiError(409, "Due cannot be paid on a credit!");
      }

      if (type === "debit" && accountExists?.currentBalance < amount) {
        throw new ApiError(
          400,
          "Not sufficient balance available for debitting!",
        );
      }

      if (categoryId) {
        const resolvedCategoryId = await addCategory(
          categoryId,
          loggedUserId,
          session,
        );
        fields.categoryId = resolvedCategoryId;
      }

      const [created] = await Transaction.create(
        [{ ownerId: loggedUserId, ...fields }],
        { session },
      );

      const balanceChange = type === "credit" ? amount : -amount;
      const balanceUpdate = await Account.updateOne(
        { _id: accountExists._id },
        { $inc: { currentBalance: balanceChange } },
        { session },
      );

      if (balanceUpdate.matchedCount !== 1) {
        throw new ApiError(404, "Account not found!");
      }

      createTransaction = created;
    });
  } finally {
    await session.endSession();
  }

  if (!createTransaction) {
    throw new ApiError(500, "Transaction could not be created!");
  }

  return res
    .status(200)
    .json(new ApiRes(200, createTransaction, "Transaction added!"));
});

const updateTransaction = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  if (!loggedUserId) {
    throw new ApiError(401, "Authentication required!");
  }

  const transaction = req.transaction;

  if (!transaction) {
    throw new ApiError(404, "Transaction not found!");
  }

  const { title, description, date, categoryId, note } = req.body;

  const fields: Partial<
    Pick<
      typeof transaction,
      "title" | "date" | "categoryId" | "description" | "note"
    >
  > = {};

  if (title) fields.title = title;
  if (date) fields.date = date;

  if (description !== undefined) fields.description = description;
  if (note !== undefined) fields.note = note;

  const session = await mongoose.startSession();
  let updatedTransaction: InstanceType<typeof Transaction> | undefined;

  try {
    await session.withTransaction(async () => {
      if (categoryId && categoryId !== "") {
        const resolvedCategoryId = await addCategory(
          categoryId,
          loggedUserId,
          session,
        );
        fields.categoryId = resolvedCategoryId;
      } else if (categoryId === "") {
        fields.categoryId = null;
      }

      Object.assign(transaction, fields);

      updatedTransaction = await transaction.save({ session });
    });
  } finally {
    await session.endSession();
  }

  return res
    .status(200)
    .json(new ApiRes(200, updatedTransaction, "Transaction updated!"));
});

const deleteTransaction = asynchandler(async (req, res) => {
  const transaction = req.transaction;

  if (!transaction) {
    throw new ApiError(404, "Transaction not found!");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await revertAccountChangesAndDeleteTransaction(transaction, session, {
        restoreReminderDue: true,
      });
    });
  } finally {
    await session.endSession();
  }

  return res.status(200).json(new ApiRes(200, {}, "Transaction deleted!"));
});

const getTransaction = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.transaction, "Transaction fetched!"));
});

const getTransactions = asynchandler(async (req, res) => {
  const transactions = await Transaction.aggregate([
    {
      $match: { ownerId: new Types.ObjectId(req.user?._id) },
    },
    {
      $lookup: {
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        as: "account",
      },
    },
    {
      $addFields: {
        account: {
          $first: "$account",
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        category: {
          $first: "$category",
        },
      },
    },
  ]);

  if (transactions?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, transactions, "No transactions found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, transactions, "Transactions fetched!"));
});

export {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  revertAccountChangesAndDeleteTransaction,
};
