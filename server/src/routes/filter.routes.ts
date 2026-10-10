import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";

import {
  getAccountTypes,
  getReminders,
  getTransactionTypes,
  getUserAccountsAsOptions,
  getUserCatigoriesAsOptions,
  getUserRemindersAsOptions,
} from "../controllers/filter.controller";

const filtersRoutes = Router();

filtersRoutes.route("/account-types").get(getAccountTypes);

filtersRoutes.route("/transaction-types").get(getTransactionTypes);

filtersRoutes.route("/reminders").get(getReminders);

filtersRoutes
  .route("/account-options")
  .get(verifyUser, getUserAccountsAsOptions);

filtersRoutes
  .route("/category-options")
  .get(verifyUser, getUserCatigoriesAsOptions);

filtersRoutes.route("/reminder-options").get(getUserRemindersAsOptions);

export default filtersRoutes;
