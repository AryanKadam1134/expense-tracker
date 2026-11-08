import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const ACCOUNT_TYPES = [
  { value: "current", label: "Current" },
  { value: "salary", label: "Salary" },
  { value: "savings", label: "Savings" },
  { value: "other", label: "Other" },
];

const TRANSACTION_TYPES = [
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

const REMINDERS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // To restrict FE from accessing the browser cookies
  secure: isProduction, // true only for https requests
  sameSite: isProduction ? "none" : "strict", // to avoid CSRF attacks
};

const SESSION_COOKIE_OPTIONS: CookieOptions = {
  ...BASE_COOKIE_OPTIONS,
};

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export {
  isProduction,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  REMINDERS,
  SESSION_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
};
