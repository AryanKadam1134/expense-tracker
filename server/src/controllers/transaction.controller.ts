import mongoose, { ClientSession, Types } from "mongoose";
import { randomUUID } from "node:crypto";

import { Account } from "../models/account.model";
import { Category } from "../models/category.model";
import { Reminder } from "../models/reminder.model";
import { Transaction, TransactionDocument } from "../models/transaction.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";
import { paginateAggregate } from "../utils/pagination";

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
  let createTransaction: TransactionDocument | undefined;

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

  if (transaction.transferId) {
    throw new ApiError(
      409,
      "Use the transfer update endpoint to update both transaction records!",
    );
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
  let updatedTransaction: TransactionDocument | undefined;

  try {
    await session.withTransaction(async () => {
      if (categoryId && categoryId !== "") {
        const resolvedCategoryId = await addCategory(
          categoryId,
          loggedUserId,
          session,
        );
        fields.categoryId = resolvedCategoryId;
      } else if (categoryId === "" || categoryId === null) {
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

  if (transaction.transferId) {
    throw new ApiError(
      409,
      "Use the transfer delete endpoint to delete both transaction records!",
    );
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
  const { page, limit } = req.query;
  const parsedPage = typeof page === "string" ? Number(page) : undefined;
  const parsedLimit = typeof limit === "string" ? Number(limit) : undefined;

  const transactions = await paginateAggregate({
    model: Transaction,
    page: parsedPage,
    limit: parsedLimit,
    pipeline: [
      {
        $match: {
          ownerId: new Types.ObjectId(req.user?._id),
          transferId: { $exists: false },
        },
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
    ],
  });

  if (transactions.data.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, transactions, "No transactions found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, transactions, "Transactions fetched!"));
});

const addB2BTransaction = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  if (!loggedUserId) {
    throw new ApiError(401, "Authentication required!");
  }

  const {
    debitAccountId,
    creditAccountId,
    title,
    description,
    date,
    categoryId,
    amount,
    note,
  } = req.body;

  // --- check if account exists --- //
  if (!debitAccountId) {
    throw new ApiError(400, "Debit Account is required!");
  }

  if (!creditAccountId) {
    throw new ApiError(400, "Credit Account is required!");
  }

  if (String(debitAccountId) === String(creditAccountId)) {
    throw new ApiError(400, "Debit and credit accounts must be different!");
  }

  // --- check required fields --- //
  if (!title) {
    throw new ApiError(400, "Title is required!");
  }

  if (!date) {
    throw new ApiError(400, "Date is required!");
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, "Enter a valid amount!");
  }
  // --- check required fields --- //

  const transferId = randomUUID();
  const sharedFields: {
    title: string;
    date: Date;
    amount: number;
    transferId: string;
    description?: string;
    categoryId?: Types.ObjectId | null;
    note?: string;
  } = {
    title,
    date: new Date(date),
    amount,
    transferId,
  };

  if (Number.isNaN(sharedFields.date.getTime())) {
    throw new ApiError(400, "Enter a valid date!");
  }

  if (description) sharedFields.description = description;
  if (note) sharedFields.note = note;

  const session = await mongoose.startSession();
  let debitTransaction: TransactionDocument | undefined;
  let creditTransaction: TransactionDocument | undefined;

  try {
    await session.withTransaction(async () => {
      const debitAccount = await Account.findOne({
        _id: debitAccountId,
        ownerId: loggedUserId,
      }).session(session);
      const creditAccount = await Account.findOne({
        _id: creditAccountId,
        ownerId: loggedUserId,
      }).session(session);

      if (!debitAccount) {
        throw new ApiError(404, "Couldn't find Debit Account!");
      }

      if (!creditAccount) {
        throw new ApiError(404, "Couldn't find Credit Account!");
      }

      if (debitAccount.currentBalance < amount) {
        throw new ApiError(
          400,
          "Not sufficient balance available for debitting!",
        );
      }

      const transactionFields = { ...sharedFields };
      if (categoryId) {
        const resolvedCategoryId = await addCategory(
          categoryId,
          loggedUserId,
          session,
        );
        transactionFields.categoryId = resolvedCategoryId;
      }

      [debitTransaction, creditTransaction] = await Transaction.create(
        [
          {
            ...transactionFields,
            ownerId: loggedUserId,
            accountId: debitAccount._id,
            type: "debit",
          },
          {
            ...transactionFields,
            ownerId: loggedUserId,
            accountId: creditAccount._id,
            type: "credit",
          },
        ],
        { session, ordered: true },
      );

      const debitUpdate = await Account.updateOne(
        { _id: debitAccount._id },
        { $inc: { currentBalance: -amount } },
        { session },
      );
      const creditUpdate = await Account.updateOne(
        { _id: creditAccount._id },
        { $inc: { currentBalance: amount } },
        { session },
      );

      if (
        !debitTransaction ||
        !creditTransaction ||
        debitUpdate.matchedCount !== 1 ||
        creditUpdate.matchedCount !== 1
      ) {
        throw new ApiError(500, "Couldn't initiate the Transaction!");
      }
    });
  } finally {
    await session.endSession();
  }

  if (!debitTransaction || !creditTransaction) {
    throw new ApiError(500, "Couldn't initiate the Transaction!");
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        { transferId, debitTransaction, creditTransaction },
        "Transaction completed!",
      ),
    );
});

const updateB2BTransaction = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  if (!loggedUserId) {
    throw new ApiError(401, "Authentication required!");
  }

  const transferId = req.params.transferId;
  const transactions = req.transferTransactions;

  if (!transferId || !transactions || transactions.length !== 2) {
    throw new ApiError(404, "Transfer not found!");
  }

  const { title, description, date, categoryId, note } = req.body;
  const fields: Partial<
    Pick<
      TransactionDocument,
      "title" | "description" | "date" | "categoryId" | "note"
    >
  > = {};

  if (title) fields.title = title;

  if (date !== undefined) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Enter a valid date!");
    }
    fields.date = parsedDate;
  }

  if (description !== undefined) fields.description = description;
  if (note !== undefined) fields.note = note;

  const session = await mongoose.startSession();
  let updatedTransactions: TransactionDocument[] = [];

  try {
    await session.withTransaction(async () => {
      const transactionFields = { ...fields };

      if (categoryId && categoryId !== "") {
        const resolvedCategoryId = await addCategory(
          categoryId,
          loggedUserId,
          session,
        );
        transactionFields.categoryId = resolvedCategoryId;
      } else if (categoryId === "" || categoryId === null) {
        transactionFields.categoryId = null;
      }

      updatedTransactions = [];
      for (const transaction of transactions) {
        Object.assign(transaction, transactionFields);
        updatedTransactions.push(await transaction.save({ session }));
      }
    });
  } finally {
    await session.endSession();
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        { transferId, transactions: updatedTransactions },
        "Transfer updated!",
      ),
    );
});

const deleteB2BTransaction = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  if (!loggedUserId) {
    throw new ApiError(401, "Authentication required!");
  }

  const transferId = req.params.transferId;
  const transactions = req.transferTransactions;

  if (!transferId || !transactions || transactions.length !== 2) {
    throw new ApiError(404, "Transfer not found!");
  }

  const debitTransaction = transactions.find(
    (transaction) => transaction.type === "debit",
  );
  const creditTransaction = transactions.find(
    (transaction) => transaction.type === "credit",
  );

  if (!debitTransaction || !creditTransaction) {
    throw new ApiError(409, "Transfer must have one debit and one credit!");
  }

  if (debitTransaction.amount !== creditTransaction.amount) {
    throw new ApiError(409, "Transfer amounts do not match!");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Reverse the debit first, then remove the transfer's credit.
      await revertAccountChangesAndDeleteTransaction(debitTransaction, session);
      await revertAccountChangesAndDeleteTransaction(
        creditTransaction,
        session,
      );
    });
  } finally {
    await session.endSession();
  }

  return res
    .status(200)
    .json(new ApiRes(200, { transferId }, "Transfer deleted!"));
});

const getB2BTransaction = asynchandler(async (req, res) => {
  const transactions = req.transferTransactions;
  const transferId = req.params.transferId;

  if (!transferId || !transactions || transactions.length !== 2) {
    throw new ApiError(404, "Transfer not found!");
  }

  const debitTransaction = transactions.find(
    (transaction) => transaction.type === "debit",
  );
  const creditTransaction = transactions.find(
    (transaction) => transaction.type === "credit",
  );

  if (!debitTransaction || !creditTransaction) {
    throw new ApiError(409, "Transfer must have one debit and one credit!");
  }

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        { transferId, debitTransaction, creditTransaction },
        "Transfer fetched!",
      ),
    );
});

const getB2BTransactions = asynchandler(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    throw new ApiError(401, "Authentication required!");
  }

  const { page, limit } = req.query;
  const parsedPage = typeof page === "string" ? Number(page) : undefined;
  const parsedLimit = typeof limit === "string" ? Number(limit) : undefined;

  const transferPage = await paginateAggregate({
    model: Transaction,
    page: parsedPage,
    limit: parsedLimit,
    pipeline: [
      {
        $match: {
          ownerId: new Types.ObjectId(ownerId),
          transferId: { $type: "string" },
        },
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
          account: { $first: "$account" },
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
          category: { $first: "$category" },
        },
      },
      {
        $group: {
          _id: "$transferId",
          transactions: { $push: "$$ROOT" },
        },
      },
    ],
  });

  const transfers = transferPage.data.flatMap(
    (group: { _id: string; transactions: TransactionDocument[] }) => {
      const debitTransaction = group.transactions.find(
        (transaction) => transaction.type === "debit",
      );
      const creditTransaction = group.transactions.find(
        (transaction) => transaction.type === "credit",
      );

      if (!debitTransaction || !creditTransaction) return [];

      return [
        {
          transferId: group._id,
          debitTransaction,
          creditTransaction,
        },
      ];
    },
  );

  return res
    .status(200)
    .json(
      new ApiRes(
        200,
        { data: transfers, pagination: transferPage.pagination },
        "Transfers fetched!",
      ),
    );
});

export {
  addTransaction,
  updateTransaction,
  updateB2BTransaction,
  deleteTransaction,
  deleteB2BTransaction,
  getTransaction,
  getTransactions,
  getB2BTransaction,
  getB2BTransactions,
  addB2BTransaction,
  revertAccountChangesAndDeleteTransaction,
};
