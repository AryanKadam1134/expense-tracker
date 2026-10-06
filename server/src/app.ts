import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(","),
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

import authRouter from "./routes/auth.routes";
import accountRouter from "./routes/account.routes";
import filtersRoutes from "./routes/filter.routes";
import transactionRouter from "./routes/transaction.routes";

app.use("/api/filters", filtersRoutes);
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

export default app;
