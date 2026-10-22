import api from "./api.service";

import type {
  ApiResponse,
  Bank,
  BankPayload,
  PaginatedData,
  PaginationParams,
} from "../types/api.types";

export const bankEndpoints = {
  addBank: (body: BankPayload) => api.post<ApiResponse<Bank>>("/banks", body),

  updateBank: (bankId: string, body: Partial<BankPayload>) =>
    api.put<ApiResponse<Bank>>(`/banks/${bankId}`, body),

  deleteBank: (bankId: string) =>
    api.delete<ApiResponse<unknown>>(`/banks/${bankId}`),

  getBank: (bankId: string) => api.get<ApiResponse<Bank>>(`/banks/${bankId}`),

  getBanks: (params: PaginationParams) =>
    api.get<ApiResponse<PaginatedData<Bank>>>("/banks", { params }),
};
