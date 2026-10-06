import { Router } from "express";

import {
  getAccountTypes,
  getReminders,
  getTransactionTypes,
} from "../controllers/filter.controller";

const filtersRoutes = Router();

filtersRoutes.route("/account-types").get(getAccountTypes);

filtersRoutes.route("/transaction-types").get(getTransactionTypes);

filtersRoutes.route("/reminders").get(getReminders);

export default filtersRoutes;
