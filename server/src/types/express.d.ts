import type { Types } from "mongoose";

import type { UserDocument } from "../models/user.model";
import type { BankDocument } from "../models/bank.model";
import type { AccountDocument } from "../models/account.model";
import type { TransactionDocument } from "../models/transaction.model";
import type { CategoryDocument } from "../models/category.model";
import type { ReminderDocument } from "../models/reminder.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      bank?: BankDocument;
      account?: AccountDocument;
      transaction?: TransactionDocument;
      category?: CategoryDocument;
      reminder?: ReminderDocument;
    }
  }
}

export {};
