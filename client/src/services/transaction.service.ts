import api from "./api.service";

import type {
  ApiResponse,
  B2BTransfer,
  B2BTransactionPayload,
  PaginatedData,
  PaginationParams,
  Transaction,
  TransactionPayload,
} from "../types/api.types";

export const transactionEndpoints = {
  addTransaction: (body: TransactionPayload) =>
    api.post<ApiResponse<Transaction>>(`/transactions`, body),

  updateTransaction: (transactionId: string, body: TransactionPayload) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${transactionId}`, body),

  deleteTransaction: (transactionId: string) =>
    api.delete<ApiResponse<unknown>>(`/transactions/${transactionId}`),

  getTransaction: (transactionId: string) =>
    api.get<ApiResponse<Transaction>>(`transactions/${transactionId}`),

  getTransactions: (params: PaginationParams) =>
    api.get<ApiResponse<PaginatedData<Transaction>>>(`/transactions`, {
      params,
    }),

  getB2BTransaction: (transferId: string) =>
    api.get<ApiResponse<B2BTransfer>>(`/transactions/transfer/${transferId}`),

  getB2BTransactions: (params: PaginationParams) =>
    api.get<ApiResponse<PaginatedData<B2BTransfer>>>(`/transactions/transfer`, {
      params,
    }),

  addB2BTransaction: (body: B2BTransactionPayload) =>
    api.post<ApiResponse<B2BTransfer>>(`/transactions/transfer`, body),

  updateB2BTransaction: (transferId: string, body: B2BTransactionPayload) =>
    api.put<ApiResponse<B2BTransfer>>(
      `/transactions/transfer/${transferId}`,
      body,
    ),

  deleteB2BTransaction: (transferId: string) =>
    api.delete<ApiResponse<unknown>>(`/transactions/transfer/${transferId}`),
};
