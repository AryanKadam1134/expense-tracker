import { Types } from "mongoose";

import { Account } from "../models/account.model";
import { Category } from "../models/category.model";
import { Transaction } from "../models/transaction.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

import { TRANSACTION_TYPES } from "../contants";

const addTransaction = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { account, title, description, type, date, category, amount, note } =
    req.body;

  // --- check if account exists --- //
  if (!account) {
    throw new ApiError(400, "Account is required!");
  }

  const accountExists = await Account.findOne({
    owner: loggedUserId,
    _id: account,
  });

  if (!accountExists) {
    throw new ApiError(404, "Account not found!");
  }
  // --- check if account exists --- //

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
    account: Types.ObjectId;
    type: string;
    date: Date;
    amount: number;
    description?: string;
    category?: Types.ObjectId;
    note?: string;
  } = {
    title,
    account,
    type,
    date,
    amount,
  };

  if (description) fields.description = description;
  if (note) fields.note = note;
  // --- assign fields --- //

  // --- check if category exists --- //
  if (category) {
    const categoryExists = await Category.findOne({
      $or: [{ _id: category }, { name: category }],
      owner: loggedUserId,
    });

    if (!categoryExists) {
      const newCategory = await Category.create({
        owner: loggedUserId,
        name: category,
      });

      fields.category = newCategory._id;
    } else {
      fields.category = categoryExists._id;
    }
  }
  // --- check if category exists --- //

  // --- create transaction & update account details --- //
  if (type === "credit") {
    accountExists.currentBalance += amount;
  } else if (type === "debit") {
    accountExists.currentBalance -= amount;
  }

  const createTransaction = await Transaction.create({
    owner: loggedUserId,
    ...fields,
  });

  await accountExists.save();
  // --- create transaction & update account details --- //

  return res
    .status(200)
    .json(new ApiRes(200, createTransaction, "Transaction added!"));
});

// const addTransaction = asynchandler(async (req, res) => {
//   const loggedUserId = req.user?._id;

//   if (!loggedUserId) {
//     throw new ApiError(401, "Authentication required!");
//   }

//   const { account, title, description, type, date, category, amount, note } =
//     req.body;

//   // --- check if account exists --- //
//   if (!account) {
//     throw new ApiError(400, "Account is required!");
//   }

//   // --- check required fields --- //
//   if (!title) {
//     throw new ApiError(400, "Title is required!");
//   }

//   if (!type) {
//     throw new ApiError(400, "Account type is required!");
//   }

//   if (!TRANSACTION_TYPES.map((t) => t.value).includes(type)) {
//     throw new ApiError(400, "Enter a valid Transaction type!");
//   }

//   if (!date) {
//     throw new ApiError(400, "Date is required!");
//   }

//   if (!amount) {
//     throw new ApiError(400, "Amount is required!");
//   }

//   if (typeof amount !== "number" || amount <= 0) {
//     throw new ApiError(400, "Enter a valid amount!");
//   }
//   // --- check required fields --- //

//   // --- assign fields --- //
//   const fields: {
//     title: string;
//     account: Types.ObjectId;
//     type: string;
//     date: Date;
//     amount: number;
//     description?: string;
//     category?: Types.ObjectId;
//     note?: string;
//   } = {
//     title,
//     account,
//     type,
//     date,
//     amount,
//   };

//   if (description) fields.description = description;
//   if (note) fields.note = note;
//   // --- assign fields --- //

//   // Create the optional category, transaction, and balance change atomically.
//   const session = await mongoose.startSession();
//   let createTransaction: InstanceType<typeof Transaction> | undefined;

//   try {
//     await session.withTransaction(async () => {
//       const accountExists = await Account.findOne({
//         owner: loggedUserId,
//         _id: account,
//       }).session(session);

//       if (!accountExists) {
//         throw new ApiError(404, "Account not found!");
//       }

//       if (category) {
//         if (typeof category !== "string") {
//           throw new ApiError(400, "Enter a valid category!");
//         }

//         const categoryValue = category.trim();
//         const categoryFilter = Types.ObjectId.isValid(categoryValue)
//           ? { _id: new Types.ObjectId(categoryValue) }
//           : { name: categoryValue };

//         let categoryExists = await Category.findOne({
//           ...categoryFilter,
//           owner: loggedUserId,
//         }).session(session);

//         if (!categoryExists && !("_id" in categoryFilter)) {
//           [categoryExists] = await Category.create(
//             [{ owner: loggedUserId, name: categoryValue }],
//             { session },
//           );
//         }

//         if (!categoryExists) {
//           throw new ApiError(404, "Category not found!");
//         }

//         fields.category = categoryExists._id;
//       }

//       const [created] = await Transaction.create(
//         [{ owner: loggedUserId, ...fields }],
//         { session },
//       );

//       const balanceChange = type === "credit" ? amount : -amount;
//       const balanceUpdate = await Account.updateOne(
//         { _id: accountExists._id, owner: loggedUserId },
//         { $inc: { currentBalance: balanceChange } },
//         { session },
//       );

//       if (balanceUpdate.matchedCount !== 1) {
//         throw new ApiError(404, "Account not found!");
//       }

//       createTransaction = created;
//     });
//   } finally {
//     await session.endSession();
//   }

//   if (!createTransaction) {
//     throw new ApiError(500, "Transaction could not be created!");
//   }

//   return res
//     .status(200)
//     .json(new ApiRes(200, createTransaction, "Transaction added!"));
// });

const updateTransaction = asynchandler(async (req, res) => {
  const transaction = req.transaction;

  if (!transaction) {
    throw new ApiError(404, "Transaction not found!");
  }

  const { title, description, date, category, note } = req.body;

  const fields: Partial<
    Pick<
      typeof transaction,
      "title" | "date" | "category" | "description" | "note"
    >
  > = {};

  if (title) fields.title = title;
  if (date) fields.date = date;

  if (category !== undefined) fields.category = category;
  if (description !== undefined) fields.description = description;
  if (note !== undefined) fields.note = note;

  Object.assign(transaction, fields);

  const updatedTransaction = await transaction.save();

  return res
    .status(200)
    .json(new ApiRes(200, updatedTransaction, "Transaction updated!"));
});

const deleteTransaction = asynchandler(async (req, res) => {
  const transaction = req.transaction;

  const account = await Account.findById(transaction?.account);

  if (!account || !transaction) {
    throw new ApiError(200, "Couldn't delete account!");
  }

  const type = transaction?.type;

  if (type === "credit") {
    account.currentBalance -= transaction.amount;
  } else if (type === "debit") {
    account.currentBalance += transaction.amount;
  }

  await account.save();

  await transaction.deleteOne();

  return res.status(200).json(new ApiRes(200, {}, "Transaction deleted!"));
});

const getTransaction = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.transaction, "Transaction fetched!"));
});

const getTransactions = asynchandler(async (req, res) => {
  const transactions = await Transaction.find({
    owner: req.user?._id,
  });

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
};
