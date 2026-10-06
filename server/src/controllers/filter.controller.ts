import { Account } from "../models/account.model";
import { Category } from "../models/category.model";

import ApiRes from "../utils/ApiRes";
import { asynchandler } from "../utils/asynchandler";

import { ACCOUNT_TYPES, REMINDERS, TRANSACTION_TYPES } from "../contants";

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

const getReminders = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiRes(200, REMINDERS, "Reminders fetched!"));
});

const getUserAccountsAsOptions = asynchandler(async (req, res) => {
  const accounts = await Account.find({
    owner: req.user?._id,
  });

  if (accounts?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, accounts, "No user accounts found!"));
  }

  const accountsAsOptions = accounts.map((account) => ({
    value: account?._id,
    label: account?.accountName,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, accountsAsOptions, "User accounts fetched!"));
});

const getUserCatigoriesAsOptions = asynchandler(async (req, res) => {
  const categories = await Category.find({
    owner: req.user?._id,
  });

  if (categories?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, categories, "No user categories found!"));
  }

  const categoriesAsOptions = categories.map((account) => ({
    value: account?._id,
    label: account?.name,
  }));

  return res
    .status(200)
    .json(new ApiRes(200, categoriesAsOptions, "User categories fetched!"));
});

export {
  getTransactionTypes,
  getAccountTypes,
  getReminders,
  getUserAccountsAsOptions,
  getUserCatigoriesAsOptions,
};
