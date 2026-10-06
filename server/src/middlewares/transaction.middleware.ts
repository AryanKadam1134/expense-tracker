import { Transaction } from "../models/transaction.model";

import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

export const getTransactionById = asynchandler(async (req, res, next) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    throw new ApiError(400, "transactionId is required!");
  }

  const transactionExists = await Transaction.findById(transactionId);

  if (!transactionExists) {
    throw new ApiError(404, "Transaction not found!");
  }

  if (transactionExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.transaction = transactionExists;

  next();
});
