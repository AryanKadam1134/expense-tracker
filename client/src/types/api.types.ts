// Shared API types

// Api Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

// User type
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
}

// Account type
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
  currentBalance?: number | null;
};
