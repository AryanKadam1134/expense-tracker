import { Account } from "../models/account.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

const addAccount = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { bankName, accountName, accountNumber, accountType, openingBalance } =
    req.body;

  if (!bankName) {
    throw new ApiError(400, "Bank name is required!");
  }

  if (!accountName) {
    throw new ApiError(400, "Account name is required!");
  }

  if (!openingBalance) {
    throw new ApiError(400, "Opening Balance is required!");
  }

  const accountNameExists = await Account.findOne({
    owner: loggedUserId,
    accountName,
  });

  if (accountNameExists) {
    throw new ApiError(400, "Account name already exists!");
  }

  const fields: {
    bankName: string;
    accountName: string;
    openingBalance: number;
    currentBalance: number;
    accountNumber?: string;
    accountType?: string;
  } = {
    bankName,
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

  const { bankName, accountName, accountNumber, accountType } = req.body;

  if (accountName) {
    const accountNameExists = await Account.findOne({
      _id: { $ne: account?._id },
      owner: account?.owner,
      accountName,
    });

    if (accountNameExists) {
      throw new ApiError(400, "Account name already exists!");
    }
  }

  const fields: Partial<
    Pick<
      typeof account,
      "bankName" | "accountName" | "accountNumber" | "accountType"
    >
  > = {};

  if (bankName) fields.bankName = bankName;
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
  await req.account?.deleteOne();

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
