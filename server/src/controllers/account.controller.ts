import mongoose, { Types } from "mongoose";

import { Account } from "../models/account.model";
import { Transaction } from "../models/transaction.model";

import { revertAccountChangesAndDeleteTransaction } from "./transaction.controller";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

const addAccount = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { bankId, name, accountNumber, accountType, openingBalance } =
    req.body;

  if (!bankId) {
    throw new ApiError(400, "Bank is required!");
  }

  if (!name) {
    throw new ApiError(400, "Account name is required!");
  }

  if (!openingBalance) {
    throw new ApiError(400, "Opening Balance is required!");
  }

  const accountWithSameName = await Account.findOne({
    ownerId: loggedUserId,
    bankId,
    name,
  });

  if (accountWithSameName) {
    throw new ApiError(400, "Account name already for this bank!");
  }

  const fields: {
    bankId: Types.ObjectId;
    name: string;
    openingBalance: number;
    currentBalance: number;
    accountNumber?: string;
    accountType?: string;
  } = {
    bankId,
    name,
    openingBalance,
    currentBalance: openingBalance,
  };

  if (accountNumber) fields.accountNumber = accountNumber;
  if (accountType) fields.accountType = accountType;

  const createAccount = await Account.create({
    ownerId: loggedUserId,
    ...fields,
  });

  return res.status(200).json(new ApiRes(200, createAccount, "Account added!"));
});

const updateAccount = asynchandler(async (req, res) => {
  const account = req.account;

  if (!account) {
    throw new ApiError(404, "Account not found!");
  }

  const { bankId, name, accountNumber, accountType } = req.body;

  if (name) {
    const accountWithSameName = await Account.findOne({
      _id: { $ne: account?._id },
      ownerId: account?.ownerId,
      bankId,
      name,
    });

    if (accountWithSameName) {
      throw new ApiError(400, "Account name already exists for this bank!");
    }
  }

  const fields: Partial<
    Pick<
      typeof account,
      "bankId" | "name" | "accountNumber" | "accountType"
    >
  > = {};

  if (bankId) fields.bankId = bankId;
  if (name) fields.name = name;

  if (accountNumber !== undefined) fields.accountNumber = accountNumber;
  if (accountType !== undefined) fields.accountType = accountType;

  Object.assign(account, fields);

  const updatedAccount = await account.save();

  return res
    .status(200)
    .json(new ApiRes(200, updatedAccount, "Account updated!"));
});

const deleteAccount = asynchandler(async (req, res) => {
  const account = req.account;

  if (!account) {
    throw new ApiError(404, "Account not found!");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const transactions = await Transaction.find({
        accountId: account._id,
      }).session(session);

      for (const transaction of transactions) {
        await revertAccountChangesAndDeleteTransaction(transaction, session, {
          restoreAccountBalance: false,
          restoreReminderDue: true,
        });
      }

      await account.deleteOne({ session });
    });
  } finally {
    await session.endSession();
  }

  return res.status(200).json(new ApiRes(200, {}, "Account deleted!"));
});

const getAccount = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiRes(200, req.account, "Account fetched!"));
});

const getAccounts = asynchandler(async (req, res) => {
  const accounts = await Account.aggregate([
    {
      $match: { ownerId: new Types.ObjectId(req.user?._id) },
    },
    {
      $lookup: {
        from: "banks",
        localField: "bankId",
        foreignField: "_id",
        as: "bank",
      },
    },
    {
      $addFields: {
        bank: {
          $first: "$bank",
        },
      },
    },
  ]);

  if (accounts?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, accounts, "No accounts found!"));
  }

  return res.status(200).json(new ApiRes(200, accounts, "Accounts fetched!"));
});

export { addAccount, updateAccount, deleteAccount, getAccount, getAccounts };
