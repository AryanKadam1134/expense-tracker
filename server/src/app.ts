import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

import authRouter from "./routes/auth.routes";

app.use("/api/auth", authRouter);

export default app;
