import api from "./api.service";
import type { AxiosRequestConfig } from "axios";

import type { Login, Register, GoogleAuth } from "../types/types";

export const authEndpoints = {
  googleAuth: (body: GoogleAuth, config?: AxiosRequestConfig) =>
    api.post(`/auth/google`, body, config),

  register: (body: Register) => api.post("/auth/register", body),

  login: (body: Login) => api.post("/auth/login", body),

  logout: () => api.post("/auth/logout"),

  refreshSession: () => api.post("/auth/refresh-session"),
};
