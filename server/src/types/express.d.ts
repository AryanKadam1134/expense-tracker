import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId | string;
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        middleName?: string;
      };
      account?: {
        _id: Types.ObjectId | string;
        owner?: Types.ObjectId | string;
        bankName?: string;
        accountName?: string;
        accountNumber?: string | null;
        accountType?: string | null;
        openingBalance?: number;
        currentBalance?: number;
      };
    }
  }
}

export {};
