import type { AxiosRequestConfig } from "axios";

import api from "./api.service";
import type { ApiResponse } from "./api.service";

import type { Login, Register, GoogleAuth, User } from "../types/types";

export const authEndpoints = {
  googleAuth: (body: GoogleAuth, config?: AxiosRequestConfig) =>
    api.post<ApiResponse<User>>(`/auth/google`, body, config),

  register: (body: Register) => api.post("/auth/register", body),

  login: (body: Login) => api.post<ApiResponse<User>>("/auth/login", body),

  logout: () => api.post("/auth/logout"),

  refreshSession: () => api.post<ApiResponse<User>>("/auth/refresh-session"),
};
