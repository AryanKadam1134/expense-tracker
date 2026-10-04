import type { Types } from "mongoose";
import type { AccountDocument } from "../models/account.model";
import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      account?: AccountDocument;
    }
  }
}

export {};
