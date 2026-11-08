import type { Types } from "mongoose";

import type { UserDocument } from "../models/user.model.ts";
import type { BankDocument } from "../models/bank.model.ts";
import type { AccountDocument } from "../models/account.model.ts";
import type { TransactionDocument } from "../models/transaction.model.ts";
import type { CategoryDocument } from "../models/category.model.ts";
import type { ReminderDocument } from "../models/reminder.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      bank?: BankDocument;
      account?: AccountDocument;
      transaction?: TransactionDocument;
      transferTransactions?: TransactionDocument[];
      category?: CategoryDocument;
      reminder?: ReminderDocument;
    }
  }
}

export {};
