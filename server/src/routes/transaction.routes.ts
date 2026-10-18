import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";
import {
  getTransactionById,
  getTransferById,
} from "../middlewares/transaction.middleware";

import {
  addTransaction,
  addB2BTransaction,
  deleteB2BTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  getB2BTransaction,
  getB2BTransactions,
  updateTransaction,
  updateB2BTransaction,
} from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.use(verifyUser);

transactionRouter.route("/").post(addTransaction).get(getTransactions);

transactionRouter
  .route("/transfer")
  .post(addB2BTransaction)
  .get(getB2BTransactions);

transactionRouter
  .route("/transfer/:transferId")
  .put(getTransferById, updateB2BTransaction)
  .delete(getTransferById, deleteB2BTransaction)
  .get(getTransferById, getB2BTransaction);

transactionRouter
  .route("/:transactionId")
  .put(getTransactionById, updateTransaction)
  .delete(getTransactionById, deleteTransaction)
  .get(getTransactionById, getTransaction);

export default transactionRouter;
