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

  if (transactionExists.ownerId.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.transaction = transactionExists;

  next();
});

export const getTransferById = asynchandler(async (req, res, next) => {
  const { transferId } = req.params;

  if (!transferId) {
    throw new ApiError(400, "transferId is required!");
  }

  const transferTransactions = await Transaction.find({ transferId });

  if (transferTransactions.length === 0) {
    throw new ApiError(404, "Transfer not found!");
  }

  if (transferTransactions.length !== 2) {
    throw new ApiError(409, "Transfer must have one debit and one credit!");
  }

  if (
    transferTransactions.some(
      (transaction) =>
        transaction.ownerId.toString() !== req.user?._id.toString(),
    )
  ) {
    throw new ApiError(403, "Unauthorized!");
  }

  const hasDebit = transferTransactions.some(
    (transaction) => transaction.type === "debit",
  );
  const hasCredit = transferTransactions.some(
    (transaction) => transaction.type === "credit",
  );

  if (!hasDebit || !hasCredit) {
    throw new ApiError(409, "Transfer must have one debit and one credit!");
  }

  req.transferTransactions = transferTransactions;
  next();
});
