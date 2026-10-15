// Shared API types

// Api Response Interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

// User Interface
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
}

// Bank Interface
export interface Bank {
  _id: string;
  ownerId: string;
  name: string;
}

// Account Interface
export interface Account {
  _id: string;
  ownerId: string;
  bankId: string;
  bank?: Bank;
  name: string;
  accountNumber?: string | null;
  accountType?: string | null;
  openingBalance: number;
  currentBalance: number;
}

// Transaction Interface
export interface Transaction {
  _id: string;
  ownerId: string;
  accountId: string;
  account?: Account;
  title: string;
  description?: string | null;
  type: string;
  date: string;
  categoryId?: string | null;
  category?: Category | null;
  amount: number;
  transferId?: string | null;
  reminderId?: string | null;
  note?: string | null;
}

// Category Interface
export interface Category {
  _id: string;
  ownerId: string;
  name: string;
}

// Reminder Interface
export interface Reminder {
  _id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  originalDue: number;
  remainingDue: number;
  dueDate: string;
  isPaid?: boolean | null;
  frequency?: string | null;
}

// Filter Interface
export interface Filter {
  value: string;
  label: string;
}

// Request Payload Types
export type GoogleAuth = {
  code: string;
  rememberMe?: boolean;
};

export type Register = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type Login = {
  userCredential: string;
  password: string;
  rememberMe?: boolean;
};

export type BankPayload = {
  name: string;
};

export type AccountPayload = {
  bankId: string;
  name: string;
  accountNumber?: string | null;
  accountType?: string | null;
  openingBalance: number;
};

export type TransactionPayload = {
  accountId: string;
  title: string;
  description?: string | null;
  type: string;
  date: string;
  categoryId?: string | null;
  amount: number;
  reminderId: string | null;
  note?: string | null;
};

export type CategoryPayload = {
  name: string;
};

export type ReminderPayload = {
  title: string;
  description?: string | null;
  originalDue: number;
  dueDate: string;
  frequency?: string | null;
};
