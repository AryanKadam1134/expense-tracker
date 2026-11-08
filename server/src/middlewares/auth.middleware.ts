import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models/user.model.ts";

import ApiError from "../utils/ApiError.ts";
import { getEnv } from "../utils/getEnv.ts";
import { asynchandler } from "../utils/asynchandler.ts";

export const verifyUser = asynchandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    throw new ApiError(401, "Access token missing!");
  }

  const decodedToken = jwt.verify(
    accessToken,
    getEnv("ACCESS_TOKEN_SECRET"),
  ) as JwtPayload & { _id?: string };

  if (!decodedToken?._id) {
    throw new ApiError(401, "Invalid access token payload!");
  }

  const user = await User.findById(decodedToken._id).select(
    "-password -googleId -otp -otpExpiryDate",
  );

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const sessionExists = user?.sessions?.some(
    (session) => session?.refreshToken === refreshToken,
  );

  if (!sessionExists) {
    throw new ApiError(401, "Session Expired!");
  }

  user.sessions = undefined;
  req.user = user;

  next();
});
