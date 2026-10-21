import api from "./api.service";

import type {
  ApiResponse,
  Reminder,
  ReminderPayload,
} from "../types/api.types";

export const reminderEndpoints = {
  addReminder: (body: ReminderPayload) =>
    api.post<ApiResponse<Reminder>>("/reminders", body),

  updateReminder: (reminderId: string, body: Partial<ReminderPayload>) =>
    api.put<ApiResponse<Reminder>>(`/reminders/${reminderId}`, body),

  deleteReminder: (reminderId: string) =>
    api.delete<ApiResponse<unknown>>(`/reminders/${reminderId}`),

  getReminder: (reminderId: string) =>
    api.get<ApiResponse<Reminder>>(`/reminders/${reminderId}`),

  getReminders: () => api.get<ApiResponse<Reminder[]>>("/reminders"),
};
