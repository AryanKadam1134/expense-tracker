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

// Account Interface
export interface Account {
  _id: string;
  owner: string;
  bankName: string;
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
  account: string;
  title: string;
  description?: string | null;
  type: string;
  date: string;
  category?: string | null;
  amount: number;
  transferId?: string | null;
  note?: string | null;
}

// Category Interface
export interface Category {
  _id: string;
  owner: string;
  name: string;
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

export type AccountPayload = {
  bankName: string;
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
  note?: string | null;
};

export type CategoryPayload = {
  name: string;
};
