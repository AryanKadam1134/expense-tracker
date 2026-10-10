import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";
import { getReminderById } from "../middlewares/reminder.middleware";

import {
  addReminder,
  deleteReminder,
  getReminder,
  getReminders,
  updateReminder,
} from "../controllers/reminder.controller";

const reminderRouter = Router();

reminderRouter.use(verifyUser);

reminderRouter.route("/").post(addReminder).get(getReminders);

reminderRouter
  .route("/:reminderId")
  .put(getReminderById, updateReminder)
  .delete(getReminderById, deleteReminder)
  .get(getReminderById, getReminder);

export default reminderRouter;
