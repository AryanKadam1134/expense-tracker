import api from "./api.service";

import type {
  ApiResponse,
  Transaction,
  TransactionPayload,
} from "../types/api.types";

export const transactionEndpoints = {
  addTransaction: (body: TransactionPayload) => api.post(`/transactions`, body),

  updateTransaction: (
    body: TransactionPayload,
    transactionId: string | undefined,
  ) => api.put(`/transactions/${transactionId}`, body),

  deleteTransaction: (transactionId: string | undefined) =>
    api.delete(`/transactions/${transactionId}`),

  getTransaction: (transactionId: string | undefined) =>
    api.get<ApiResponse<Transaction>>(`transactions/${transactionId}`),

  getTransactions: () => api.get<ApiResponse<Transaction[]>>(`/transactions`),
};
