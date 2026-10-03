import api from "./api.service";

import type { AccountPayload } from "../types/api.types";

export const accountEndpoints = {
  addAccount: (body: AccountPayload) => api.post(`/account`, body),
};
