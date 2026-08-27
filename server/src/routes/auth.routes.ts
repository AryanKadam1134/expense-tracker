import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/register").post(registerUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/logout").post(verifyUser, logoutUser);

export default authRouter;
