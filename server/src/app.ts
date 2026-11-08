import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { requestLogger } from "./middlewares/requestLogger.middleware.ts";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(","),
    credentials: true,
  }),
);

app.use(requestLogger);

app.use(express.json());
app.use(cookieParser());

import authRouter from "./routes/auth.routes.ts";
import accountRouter from "./routes/account.routes.ts";
import filtersRoutes from "./routes/filter.routes.ts";
import transactionRouter from "./routes/transaction.routes.ts";
import categoryRouter from "./routes/category.routes.ts";
import reminderRouter from "./routes/reminder.routes.ts";
import bankRouter from "./routes/bank.routes.ts";

app.use("/api/filters", filtersRoutes);
app.use("/api/auth", authRouter);
app.use("/api/banks", bankRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reminders", reminderRouter);

export default app;
