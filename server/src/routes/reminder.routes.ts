import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware.ts";
import { getReminderById } from "../middlewares/reminder.middleware.ts";

import {
  addReminder,
  deleteReminder,
  getReminder,
  getReminders,
  updateReminder,
} from "../controllers/reminder.controller.ts";

const reminderRouter = Router();

reminderRouter.use(verifyUser);

reminderRouter.route("/").post(addReminder).get(getReminders);

reminderRouter
  .route("/:reminderId")
  .put(getReminderById, updateReminder)
  .delete(getReminderById, deleteReminder)
  .get(getReminderById, getReminder);

export default reminderRouter;
