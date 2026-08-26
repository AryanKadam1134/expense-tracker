import { User } from "../models/user.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";

import { asynchandler } from "../utils/asynchandler";

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
    throw new ApiError(400, "passowrd is required!");
  }

  const userExists = await User.findOne({
    $or: [{ username: userCredential }, { password: userCredential }],
  });

  if (!userExists) {
    throw new ApiError(404, "user not found!");
  }

  const isPasswordCorrect = userExists.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "invalid password!");
  }

  const { accessToken, refreshToken } =
    userExists.generateAccessAndRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new ApiError(503, "Couldn't generate access or refresh token!");
  }

  const loggedUser = await User.findById(userExists._id).select(
    "-passowrd -sessions -otp -otpExpiryDate",
  );

  if (!loggedUser) {
    throw new ApiError(500, "Error logging in user!");
  }

  return res
    .status(200)
    .json(
      new ApiRes(200, { user: loggedUser }, "user logged in successfully!"),
    );
});

const logoutUser = asynchandler(async (req: any, res) => {
  const cookiesRefreshToken = req.cookies?.refreshToken;

  await User.findByIdAndUpdate(req.user?._id, {
    $pull: { sessions: { refreshToken: cookiesRefreshToken } },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRes(204, {}, "user logged out successfully!"));
});

export { registerUser, loginUser, logoutUser };
