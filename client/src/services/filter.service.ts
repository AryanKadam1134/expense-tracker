import api from "./api.service";

import type { ApiResponse, Filter, ReminderOption } from "../types/api.types";

export const filterEndpoints = {
  getBanksOptions: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/bank-options`),

  getAccountTypes: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/account-types`),

  getTransactionTypes: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/transaction-types`),

  getReminderRepeats: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/reminder-repeats`),

  getReminderOptions: () =>
    api.get<ApiResponse<ReminderOption[]>>(`/filters/reminder-options`),

  getAccountOptions: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/account-options`),

  getCategoryOptions: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/category-options`),
};
