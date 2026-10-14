import mongoose, { Types } from "mongoose";

import { Account } from "../models/account.model";
import { Transaction } from "../models/transaction.model";

import { revertAccountChangesAndDeleteTransaction } from "./transaction.controller";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

const addAccount = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { bank, accountName, accountNumber, accountType, openingBalance } =
    req.body;

  if (!bank) {
    throw new ApiError(400, "Bank is required!");
  }

  if (!accountName) {
    throw new ApiError(400, "Account name is required!");
  }

  if (!openingBalance) {
    throw new ApiError(400, "Opening Balance is required!");
  }

  const accountNameExists = await Account.findOne({
    owner: loggedUserId,
    bank,
    accountName,
  });

  if (accountNameExists) {
    throw new ApiError(400, "Account name already for this bank!");
  }

  const fields: {
    bank: Types.ObjectId;
    accountName: string;
    openingBalance: number;
    currentBalance: number;
    accountNumber?: string;
    accountType?: string;
  } = {
    bank,
    accountName,
    openingBalance,
    currentBalance: openingBalance,
  };

  if (accountNumber) fields.accountNumber = accountNumber;
  if (accountType) fields.accountType = accountType;

  const createAccount = await Account.create({
    owner: loggedUserId,
    ...fields,
  });

  return res.status(200).json(new ApiRes(200, createAccount, "Account added!"));
});

const updateAccount = asynchandler(async (req, res) => {
  const account = req.account;

  if (!account) {
    throw new ApiError(404, "Account not found!");
  }

  const { bank, accountName, accountNumber, accountType } = req.body;

  if (accountName) {
    const accountNameExists = await Account.findOne({
      _id: { $ne: account?._id },
      owner: account?.owner,
      bank,
      accountName,
    });

    if (accountNameExists) {
      throw new ApiError(400, "Account name already exists for this bank!");
    }
  }

  const fields: Partial<
    Pick<
      typeof account,
      "bank" | "accountName" | "accountNumber" | "accountType"
    >
  > = {};

  if (bank) fields.bank = bank;
  if (accountName) fields.accountName = accountName;

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
        account: account._id,
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
  const accounts = await Account.find({
    owner: req.user?._id,
  });

  if (accounts?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, accounts, "No accounts found!"));
  }

  return res.status(200).json(new ApiRes(200, accounts, "Accounts fetched!"));
});

export { addAccount, updateAccount, deleteAccount, getAccount, getAccounts };
