import { Account } from "../models/account.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

const addAccount = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const {
    bankName,
    accountName,
    accountNumber,
    accountType,
    openingBalance,
  } = req.body;

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

export { addAccount };
