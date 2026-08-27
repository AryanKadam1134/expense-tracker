import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const ACCOUNT_TYPES = [
  { value: "current", label: "Current" },
  { value: "salary", label: "Salary" },
  { value: "savings", label: "Savings" },
  { value: "other", label: "Other" },
];

const TRANSACTION_TYPE = [
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

const REMINDERS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "strict",
};

const ACCESS_TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "strict",
};

const REFRESH_TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction ? true : false,
  sameSite: isProduction ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export {
  isProduction,
  ACCOUNT_TYPES,
  TRANSACTION_TYPE,
  REMINDERS,
  TOKEN_OPTIONS,
  ACCESS_TOKEN_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
};
