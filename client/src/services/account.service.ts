import api from "./api.service";

import type { Account, AccountPayload, ApiResponse } from "../types/api.types";

export const accountEndpoints = {
  addAccount: (body: AccountPayload) => api.post(`/accounts`, body),

  updateAccount: (body: AccountPayload, accountId: string | undefined) =>
    api.put(`/accounts/${accountId}`, body),

  deleteAccount: (accountId: string | undefined) =>
    api.delete(`/accounts/${accountId}`),

  getAccount: (accountId: string | undefined) =>
    api.get<ApiResponse<Account>>(`/accounts/${accountId}`),

  getAccounts: () => api.get<ApiResponse<Account[]>>(`/accounts`),
};
