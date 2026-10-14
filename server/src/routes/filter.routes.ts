import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";

import {
  getAccountTypes,
  getReminderRepeats,
  getTransactionTypes,
  getUserAccountsAsOptions,
  getUserCatigoriesAsOptions,
  getReminderOptions,
  getUserBanksAsOptions,
} from "../controllers/filter.controller";

const filtersRoutes = Router();

filtersRoutes.route("/account-types").get(getAccountTypes);

filtersRoutes.route("/transaction-types").get(getTransactionTypes);

filtersRoutes.route("/reminder-repeats").get(getReminderRepeats);

filtersRoutes.route("/bank-options").get(verifyUser, getUserBanksAsOptions);

filtersRoutes
  .route("/account-options")
  .get(verifyUser, getUserAccountsAsOptions);

filtersRoutes
  .route("/category-options")
  .get(verifyUser, getUserCatigoriesAsOptions);

filtersRoutes.route("/reminder-options").get(verifyUser, getReminderOptions);

export default filtersRoutes;
