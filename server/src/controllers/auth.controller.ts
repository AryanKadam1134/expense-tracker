import { Request } from "express";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models/user.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { getEnv } from "../utils/getEnv";
import { asynchandler } from "../utils/asynchandler";

import {
  ACCESS_TOKEN_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
  TOKEN_OPTIONS,
} from "../contants";

const generateAccessAndRefreshToken = async (
  userId: string | Types.ObjectId,
  req: Request,
): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
  if (!userId) return;

  const rawDeviceId = req.headers["x-device-id"];
  const deviceId = Array.isArray(rawDeviceId) ? rawDeviceId[0] : rawDeviceId;

  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  const rawUserAgent = req.headers["user-agent"];
  const userAgent = Array.isArray(rawUserAgent)
    ? rawUserAgent[0]
    : rawUserAgent;

  const ip = req.ip;
  const createdAt = new Date();

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    const sessions = user.sessions ?? [];

    const existingSessionIndex = sessions.findIndex(
      (session) => session.deviceId === deviceId,
    );

    if (existingSessionIndex !== -1) {
      const session = sessions[existingSessionIndex];
      session.refreshToken = refreshToken;
      session.userAgent = userAgent;
      session.ip = ip;
      session.createdAt = createdAt;
    } else {
      const newSession = {
        refreshToken,
        userAgent,
        ip,
        deviceId,
        rememberMe: req.body.rememberMe ?? false,
        createdAt,
      };

      if (sessions.length < 5) {
        sessions.push(newSession);
      } else {
        const replaceableSessionIndex = sessions.findIndex(
          (session) => session?.rememberMe === true,
        );

        if (replaceableSessionIndex === -1) {
          throw new ApiError(429, "Maximum devices limit reached (5)");
        }

        sessions[replaceableSessionIndex] = newSession;
      }
    }

    user.sessions = sessions;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating Access or Refresh Token: ", error);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    }

    throw new ApiError(500, "Error generating access or refresh token!");
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (
    [username, email, password, firstName, lastName].some(
      (field) => typeof field === "string" && field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const userExists = await User.find({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(409, "User already exists with same username or email!");
  }

  const createdUser = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
  });

  return res
    .status(201)
    .json(new ApiRes(201, {}, "user created successfully!"));
});

const loginUser = asynchandler(async (req, res) => {
  const { userCredential, password } = req.body;

  if (!userCredential) {
    throw new ApiError(400, "username or email is required!");
  }

  if (!password) {
    throw new ApiError(400, "password is required!");
  }

  const userExists = await User.findOne({
    $or: [{ username: userCredential }, { password: userCredential }],
  });

  if (!userExists) {
    throw new ApiError(404, "user not found!");
  }

  const isPasswordCorrect = await userExists.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "invalid password!");
  }

  const tokens = await generateAccessAndRefreshToken(userExists._id, req);

  if (!tokens) {
    throw new ApiError(503, "Couldn't generate access or refresh token!");
  }

  const { accessToken, refreshToken } = tokens;

  const loggedUser = await User.findById(userExists._id).select(
    "-password -sessions -googleId -otp -otpExpiryDate",
  );

  if (!loggedUser) {
    throw new ApiError(500, "Error logging in user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, ACCESS_TOKEN_OPTIONS)
    .cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS)
    .json(
      new ApiRes(200, { user: loggedUser }, "user logged in successfully!"),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  const cookiesRefreshToken = req.cookies?.refreshToken;

  await User.findByIdAndUpdate(req.user?._id, {
    $pull: { sessions: { refreshToken: cookiesRefreshToken } },
  });

  return res
    .status(204)
    .clearCookie("accessToken", TOKEN_OPTIONS)
    .clearCookie("refreshToken", TOKEN_OPTIONS)
    .json(new ApiRes(204, {}, "user logged out successfully!"));
});

const refreshSession = asynchandler(async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken;

  const deviceId = req.headers["x-device-id"];

  if (!deviceId) {
    throw new ApiError(400, "Device ID missing");
  }

  const decodeToken = jwt.verify(
    cookieRefreshToken,
    getEnv("REFRESH_TOKEN_SECRET"),
  ) as JwtPayload & { _id?: string };

  if (!decodeToken?._id) {
    throw new ApiError(401, "Invalid refresh token payload!");
  }

  const loggedUser = await User.findById(decodeToken._id);

  if (!loggedUser) {
    throw new ApiError(404, "User not found!");
  }

  const session = loggedUser?.sessions?.find(
    (session) => session?.deviceId === deviceId,
  );

  if (!session) {
    throw new ApiError(401, "Session expired!");
  }

  const rememberMe = session.rememberMe;

  const tokens = await generateAccessAndRefreshToken(decodeToken._id, req);

  if (!tokens) {
    throw new ApiError(503, "Couldn't generate access or refresh token!");
  }

  const { accessToken, refreshToken } = tokens;

  const user = await User.findById(decodeToken._id).select(
    "-password -sessions -googleId -otp -otpExpiryDate",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, ACCESS_TOKEN_OPTIONS)
    .cookie(
      "refreshToken",
      refreshToken,
      rememberMe ? REFRESH_TOKEN_OPTIONS : TOKEN_OPTIONS,
    )
    .json(new ApiRes(200, { user }, "refreshed tokens successfully!"));
});

export { refreshSession, registerUser, loginUser, logoutUser };
