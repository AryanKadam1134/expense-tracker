import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";

import { addTransaction } from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.use(verifyUser);

transactionRouter.route("/").post(addTransaction);

export default transactionRouter;
