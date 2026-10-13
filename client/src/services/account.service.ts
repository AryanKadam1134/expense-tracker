import api from "./api.service";

import type { Account, AccountPayload, ApiResponse } from "../types/api.types";

export const accountEndpoints = {
  addAccount: (body: AccountPayload) =>
    api.post<ApiResponse<Account>>(`/accounts`, body),

  updateAccount: (body: AccountPayload, accountId: string) =>
    api.put<ApiResponse<Account>>(`/accounts/${accountId}`, body),

  deleteAccount: (accountId: string) =>
    api.delete<ApiResponse<unknown>>(`/accounts/${accountId}`),

  getAccount: (accountId: string) =>
    api.get<ApiResponse<Account>>(`/accounts/${accountId}`),

  getAccounts: () => api.get<ApiResponse<Account[]>>(`/accounts`),
};
