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
  owner: string;
  name: string;
}

// Account Interface
export interface Account {
  _id: string;
  owner: string;
  bank: Bank;
  accountName: string;
  accountNumber?: string | null;
  accountType?: string | null;
  openingBalance: number;
  currentBalance: number;
}

// Transaction Interface
export interface Transaction {
  _id: string;
  owner: string;
  account: Account;
  title: string;
  description?: string | null;
  type: string;
  date: string;
  category?: Category | null;
  amount: number;
  transferId?: string | null;
  reminder?: string | null;
  note?: string | null;
}

// Category Interface
export interface Category {
  _id: string;
  owner: string;
  name: string;
}

// Reminder Interface
export interface Reminder {
  _id: string;
  owner: string;
  title: string;
  description?: string | null;
  openingDue: number;
  currentDue: number;
  dueDate: string;
  isPaid?: boolean | null;
  repeat?: string | null;
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
  bank: string;
  accountName: string;
  accountNumber?: string | null;
  accountType?: string | null;
  openingBalance: number;
};

export type TransactionPayload = {
  account: string;
  title: string;
  description?: string | null;
  type: string;
  date: string;
  category?: string | null;
  amount: number;
  reminder: string | null;
  note?: string | null;
};

export type CategoryPayload = {
  name: string;
};

export type ReminderPayload = {
  title: string;
  description?: string | null;
  openingDue: number;
  dueDate: string;
  repeat?: string | null;
};
