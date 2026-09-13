import axios, { type AxiosResponse, type AxiosError } from "axios";
import type { User } from "../types/types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Generic API Response Type
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

// Auth Response Types
export interface AuthResponseData {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export type AuthResponse = ApiResponse<AuthResponseData>;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Response interceptor: Type responses as ApiResponse
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiResponse> | unknown) => {
    if (error instanceof axios.AxiosError) {
      return Promise.reject(error.response?.data || error);
    }

    return Promise.reject(error);
  },
);

export default api;
