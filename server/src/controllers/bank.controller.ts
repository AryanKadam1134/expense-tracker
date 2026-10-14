import mongoose from "mongoose";

import { Bank } from "../models/bank.model";
import { Account } from "../models/account.model";
import { Transaction } from "../models/transaction.model";

import { revertAccountChangesAndDeleteTransaction } from "./transaction.controller";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

const addBank = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const bankExists = await Bank.findOne({
    name,
    owner: loggedUserId,
  });

  if (bankExists) {
    throw new ApiError(400, "Bank already exists!");
  }

  const createBank = await Bank.create({
    name,
    owner: loggedUserId,
  });

  return res.status(200).json(new ApiRes(200, createBank, "Bank added!"));
});

const updateBank = asynchandler(async (req, res) => {
  const bank = req.bank;

  if (!bank) {
    throw new ApiError(404, "Bank not found!");
  }

  const loggedUserId = req.user?._id;

  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const bankExists = await Bank.findOne({
    _id: { $ne: bank?._id },
    name,
    owner: loggedUserId,
  });

  if (bankExists) {
    throw new ApiError(400, "Bank already exists!");
  }

  Object.assign(bank, { name });

  const updateBank = await bank.save();

  return res.status(200).json(new ApiRes(200, updateBank, "Bank updated!"));
});

const deleteBank = asynchandler(async (req, res) => {
  const bank = req.bank;

  if (!bank) {
    throw new ApiError(404, "Bank not found!");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const accounts = await Account.find({ bank: bank._id }).session(session);

      for (const account of accounts) {
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
      }

      await bank.deleteOne({ session });
    });
  } finally {
    await session.endSession();
  }

  return res.status(200).json(new ApiRes(200, {}, "Bank deleted!"));
});

const getBank = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiRes(200, req.bank, "Bank fetched!"));
});

const getBanks = asynchandler(async (req, res) => {
  const banks = await Bank.find({ owner: req.user?._id });

  if (banks?.length === 0) {
    return res.status(200).json(new ApiRes(200, banks, "No banks found!"));
  }

  return res.status(200).json(new ApiRes(200, banks, "Banks fetched!"));
});

export { addBank, updateBank, deleteBank, getBank, getBanks };
