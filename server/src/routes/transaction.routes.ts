import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";
import { getTransactionById } from "../middlewares/transaction.middleware";

import {
  addTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.use(verifyUser);

transactionRouter.route("/").post(addTransaction).get(getTransactions);

transactionRouter
  .route("/transactionId")
  .put(getTransactionById, updateTransaction)
  .delete(getTransactionById, deleteTransaction)
  .get(getTransactionById, getTransaction);

export default transactionRouter;
