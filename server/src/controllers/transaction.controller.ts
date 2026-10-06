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

export { addTransaction };
