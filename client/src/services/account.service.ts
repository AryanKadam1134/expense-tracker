import api from "./api.service";

import type {
  Account,
  AccountPayload,
  ApiResponse,
  PaginationData,
  PaginationParams,
} from "../types/api.types";

interface AccountsResponse {
  data: Account[];
  pagination: PaginationData;
}

export const accountEndpoints = {
  addAccount: (body: AccountPayload) =>
    api.post<ApiResponse<Account>>(`/accounts`, body),

  updateAccount: (accountId: string, body: AccountPayload) =>
    api.put<ApiResponse<Account>>(`/accounts/${accountId}`, body),

  deleteAccount: (accountId: string) =>
    api.delete<ApiResponse<unknown>>(`/accounts/${accountId}`),

  getAccount: (accountId: string) =>
    api.get<ApiResponse<Account>>(`/accounts/${accountId}`),

  getAccounts: (params: PaginationParams) =>
    api.get<ApiResponse<AccountsResponse>>(`/accounts`, { params }),
};
