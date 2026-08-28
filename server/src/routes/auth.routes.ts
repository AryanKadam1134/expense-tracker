import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/register").post(registerUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/logout").post(verifyUser, logoutUser);

authRouter.route("/refresh-tokens").post(refreshAccessToken);

export default authRouter;
