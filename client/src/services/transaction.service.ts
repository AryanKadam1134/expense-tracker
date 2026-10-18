import api from "./api.service";

import type {
  ApiResponse,
  B2BTransfer,
  B2BTransactionPayload,
  B2BTransactionUpdatePayload,
  Transaction,
  TransactionPayload,
} from "../types/api.types";

export const transactionEndpoints = {
  addTransaction: (body: TransactionPayload) =>
    api.post<ApiResponse<Transaction>>(`/transactions`, body),

  updateTransaction: (body: TransactionPayload, transactionId: string) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${transactionId}`, body),

  deleteTransaction: (transactionId: string) =>
    api.delete<ApiResponse<unknown>>(`/transactions/${transactionId}`),

  getTransaction: (transactionId: string) =>
    api.get<ApiResponse<Transaction>>(`transactions/${transactionId}`),

  getTransactions: () => api.get<ApiResponse<Transaction[]>>(`/transactions`),

  getB2BTransaction: (transferId: string) =>
    api.get<ApiResponse<B2BTransfer>>(`/transactions/transfer/${transferId}`),

  getB2BTransactions: () =>
    api.get<ApiResponse<B2BTransfer[]>>(`/transactions/transfer`),

  addB2BTransaction: (body: B2BTransactionPayload) =>
    api.post<ApiResponse<B2BTransfer>>(`/transactions/transfer`, body),

  updateB2BTransaction: (
    transferId: string,
    body: B2BTransactionUpdatePayload,
  ) => api.put<ApiResponse<B2BTransfer>>(`/transactions/transfer/${transferId}`, body),

  deleteB2BTransaction: (transferId: string) =>
    api.delete<ApiResponse<unknown>>(`/transactions/transfer/${transferId}`),
};
