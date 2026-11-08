import { Bank } from "../models/bank.model.ts";
import { Account } from "../models/account.model.ts";
import { Category } from "../models/category.model.ts";
import { Reminder } from "../models/reminder.model.ts";

import ApiRes from "../utils/ApiRes.ts";
import { asynchandler } from "../utils/asynchandler.ts";

import { ACCOUNT_TYPES, REMINDERS, TRANSACTION_TYPES } from "../contants.ts";

const getAccountTypes = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, ACCOUNT_TYPES, "Account types fetched!"));
});

const getTransactionTypes = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, TRANSACTION_TYPES, "Transaction types fetched!"));
});

const getReminderRepeats = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiRes(200, REMINDERS, "Reminders fetched!"));
});

const getUserBanksAsOptions = asynchandler(async (req, res) => {
  const banks = await Bank.find({
    ownerId: req.user?._id,
  });

  if (banks?.length === 0) {
    return res.status(200).json(new ApiRes(200, banks, "No banks found!"));
  }

  const banksAsOptions = banks.map((bank) => ({
    label: bank?.name,
    value: bank?._id,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, banksAsOptions, "User banks fetched!"));
});

const getUserAccountsAsOptions = asynchandler(async (req, res) => {
  const accounts = await Account.find({
    ownerId: req.user?._id,
  });

  if (accounts?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, accounts, "No user accounts found!"));
  }

  const accountsAsOptions = accounts.map((account) => ({
    value: account?._id,
    label: account?.name,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, accountsAsOptions, "User accounts fetched!"));
});

const getUserCategoriesAsOptions = asynchandler(async (req, res) => {
  const categories = await Category.find({
    ownerId: req.user?._id,
  });

  if (categories?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, categories, "No user categories found!"));
  }

  const categoriesAsOptions = categories.map((category) => ({
    value: category?._id,
    label: category?.name,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, categoriesAsOptions, "User categories fetched!"));
});

const getReminderOptions = asynchandler(async (req, res) => {
  const reminders = await Reminder.find({
    ownerId: req.user?._id,
    remainingDue: { $gt: 0 },
  });

  if (reminders?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, reminders, "No user reminders found!"));
  }

  const remindersAsOptions = reminders.map((reminder) => ({
    value: reminder?._id,
    label: reminder?.title,
    remainingDue: reminder.remainingDue,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, remindersAsOptions, "User reminders fetched!"));
});

export {
  getTransactionTypes,
  getAccountTypes,
  getReminderRepeats,
  getUserBanksAsOptions,
  getUserAccountsAsOptions,
  getUserCategoriesAsOptions,
  getReminderOptions,
};
