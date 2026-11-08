import { Category } from "../models/category.model.ts";

import ApiError from "../utils/ApiError.ts";
import { asynchandler } from "../utils/asynchandler.ts";

export const getCategoryById = asynchandler(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, "categoryId is required!");
  }

  const categoryExists = await Category.findById(categoryId);

  if (!categoryExists) {
    throw new ApiError(404, "Category not found!");
  }

  if (categoryExists.ownerId.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized!");
  }

  req.category = categoryExists;

  next();
});
