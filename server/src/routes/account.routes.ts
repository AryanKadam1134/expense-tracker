import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";
import { getAccountById } from "../middlewares/account.middleware";

import {
  addAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
} from "../controllers/account.controller";

const accountRouter = Router();

accountRouter.use(verifyUser);

accountRouter.route("/").post(addAccount).get(getAccounts);

accountRouter
  .route("/:accountId")
  .put(getAccountById, updateAccount)
  .delete(getAccountById, deleteAccount)
  .get(getAccountById, getAccount);

export default accountRouter;
