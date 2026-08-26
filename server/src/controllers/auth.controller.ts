import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asynchandler";

const registerUser = asyncHandler(async (req, res) => {
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

  
});
