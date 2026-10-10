import api from "./api.service";

import type {
  ApiResponse,
  Category,
  CategoryPayload,
} from "../types/api.types";

export const categoryEndpoints = {
  addCategory: (body: CategoryPayload) =>
    api.post<ApiResponse<Category>>("/categories", body),

  updateCategory: (body: CategoryPayload, categoryId: string | undefined) =>
    api.put<ApiResponse<Category>>(`/categories/${categoryId}`, body),

  deleteCategory: (categoryId: string | undefined) =>
    api.delete<ApiResponse<unknown>>(`/categories/${categoryId}`),

  getCategory: (categoryId: string | undefined) =>
    api.get<ApiResponse<Category>>(`/categories/${categoryId}`),

  getCategories: () => api.get<ApiResponse<Category[]>>("/categories"),
};
