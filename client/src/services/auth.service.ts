import api from "./api.service";

import type { Login, Register } from "../types/types";

export const authEndpoints = {
  register: (body: Register) => api.post("/auth/register", body),

  login: (body: Login) => api.post("/auth/login", body),

  logout: () => api.post("/auth/logout"),

  refreshSession: () => api.post("/auth/refresh-session"),
};
