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

export { getTransactionTypes, getAccountTypes, getReminders };
