import api from "./api.service";

import type { ApiResponse, Bank, BankPayload } from "../types/api.types";

export const bankEndpoints = {
  addBank: (body: BankPayload) => api.post<ApiResponse<Bank>>("/banks", body),

  updateBank: (body: BankPayload, bankId: string) =>
    api.put<ApiResponse<Bank>>(`/banks/${bankId}`, body),

  deleteBank: (bankId: string) =>
    api.delete<ApiResponse<unknown>>(`/banks/${bankId}`),

  getBank: (bankId: string) => api.get<ApiResponse<Bank>>(`/banks/${bankId}`),

  getBanks: () => api.get<ApiResponse<Bank[]>>("/banks"),
};
