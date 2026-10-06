import api from "./api.service";

import type { ApiResponse, Filter } from "../types/api.types";

export const filterEndpoints = {
  getAccountTypes: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/account-types`),

  getTransactionTypes: () =>
    api.get<ApiResponse<Filter[]>>(`/filters/transaction-types`),

  getReminders: () => api.get<ApiResponse<Filter[]>>(`/filters/reminders`),
};
