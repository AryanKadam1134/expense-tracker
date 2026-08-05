import { Schema, model } from "mongoose";

const userScheme = new Schema(
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
      required: [true, "password is required!"],
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

export const User = model("User", userScheme);
