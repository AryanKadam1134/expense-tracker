import api from "./api.service";

import type {
  ApiResponse,
  Category,
  CategoryPayload,
  PaginatedData,
  PaginationParams,
} from "../types/api.types";

export const categoryEndpoints = {
  addCategory: (body: CategoryPayload) =>
    api.post<ApiResponse<Category>>("/categories", body),

  updateCategory: (categoryId: string, body: Partial<CategoryPayload>) =>
    api.put<ApiResponse<Category>>(`/categories/${categoryId}`, body),

  deleteCategory: (categoryId: string) =>
    api.delete<ApiResponse<unknown>>(`/categories/${categoryId}`),

  getCategory: (categoryId: string) =>
    api.get<ApiResponse<Category>>(`/categories/${categoryId}`),

  getCategories: (params: PaginationParams) =>
    api.get<ApiResponse<PaginatedData<Category>>>("/categories", { params }),
};
