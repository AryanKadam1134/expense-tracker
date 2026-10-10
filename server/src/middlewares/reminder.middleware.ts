import { Reminder } from "../models/reminder.model";

import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

export const getReminderById = asynchandler(async (req, res, next) => {
  const { reminderId } = req.params;

  if (!reminderId) {
    throw new ApiError(400, "reminderId is required!");
  }

  const reminderExists = await Reminder.findById(reminderId);

  if (!reminderExists) {
    throw new ApiError(404, "Reminder not found!");
  }

  if (reminderExists.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.reminder = reminderExists;

  next();
});
