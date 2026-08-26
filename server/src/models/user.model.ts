import { Schema, model, Model } from "mongoose";

import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

interface UserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;

  generateAccessAndRefreshToken(): {
    accessToken: string;
    refreshToken: string;
  };
}

interface User {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  googleId?: string;
  otp?: number;
  otpExpiryDate?: Date;
  sessions: {
    refreshToken: string;
    userAgent?: string;
    ip?: string;
    deviceId?: string;
    rememberMe?: boolean;
    createdAt: Date;
  }[];
}

const userScheme = new Schema<User, Model<User, {}, UserMethods>, UserMethods>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
    },
    password: {
      type: String,

      trim: true,
    },

    firstName: { type: String, required: true },
    middleName: String,
    lastName: String,

    googleId: String,

    otp: Number,
    otpExpiryDate: Date,

    sessions: [
      {
        refreshToken: { type: String, required: true },
        userAgent: String,
        ip: String,
        deviceId: String,
        rememberMe: Boolean,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

userScheme.pre("save", async function () {
  // Google user
  if (!this.password) return;

  // Return if not modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userScheme.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password ?? "");
};

const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const ACCESS_TOKEN_EXPIRY = getEnv(
  "ACCESS_TOKEN_EXPIRY",
) as SignOptions["expiresIn"];

const REFRESH_TOKEN_EXPIRY = getEnv(
  "REFRESH_TOKEN_EXPIRY",
) as SignOptions["expiresIn"];

userScheme.methods.generateAccessAndRefreshToken = function () {
  return {
    accessToken: jwt.sign(
      {
        _id: this._id,
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
      },
      getEnv("ACCESS_TOKEN_SECRET"),
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      },
    ),
    refreshToken: jwt.sign(
      {
        _id: this._id,
      },
      getEnv("REFRESH_TOKEN_SECRET"),
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      },
    ),
  };
};

export const User = model("User", userScheme);
