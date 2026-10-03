import { Account } from "../models/account.model";

import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

export const getAccountById = asynchandler(async (req, res, next) => {
  const { accountId } = req.params;

  if (!accountId) {
    throw new ApiError(400, "accountId is required!");
  }

  const accountExists = await Account.findById(accountId);

  if (!accountExists) {
    throw new ApiError(404, "Account not found!");
  }

  if (accountExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.account = accountExists;

  next();
});
