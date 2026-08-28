import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";

import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/register").post(registerUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/logout").post(verifyUser, logoutUser);

authRouter.route("/refresh-session").post(refreshSession);

export default authRouter;
