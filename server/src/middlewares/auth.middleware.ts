import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models/user.model";

import ApiError from "../utils/ApiError";
import { getEnv } from "../utils/getEnv";
import { asynchandler } from "../utils/asynchandler";

export const verifyUser = asynchandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

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
    "-password -sessions -googleId -otp -otpExpiryDate",
  );

  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  req.user = user;

  next();
});
