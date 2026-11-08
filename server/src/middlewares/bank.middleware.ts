import { Bank } from "../models/bank.model.ts";

import ApiError from "../utils/ApiError.ts";
import { asynchandler } from "../utils/asynchandler.ts";

export const getBankById = asynchandler(async (req, res, next) => {
  const { bankId } = req.params;

  if (!bankId) {
    throw new ApiError(400, "bankId is required!");
  }

  const bankExists = await Bank.findById(bankId);

  if (!bankExists) {
    throw new ApiError(404, "Bank not found!");
  }

  if (bankExists.ownerId.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.bank = bankExists;

  next();
});
