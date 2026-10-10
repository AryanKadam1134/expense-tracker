import { Category } from "../models/category.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

const addCategory = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const categoryExists = await Category.findOne({
    name,
    owner: loggedUserId,
  });

  if (categoryExists) {
    throw new ApiError(400, "Category already exists!");
  }

  const createCategory = await Category.create({
    name,
    owner: loggedUserId,
  });

  return res
    .status(200)
    .json(new ApiRes(200, createCategory, "Category added!"));
});

const updateCategory = asynchandler(async (req, res) => {
  const category = req.category;

  if (!category) {
    throw new ApiError(404, "Category not found!");
  }

  const loggedUserId = req.user?._id;

  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const categoryExists = await Category.findOne({
    _id: { $ne: category?._id },
    name,
    owner: loggedUserId,
  });

  if (categoryExists) {
    throw new ApiError(400, "Category already exists!");
  }

  Object.assign(category, { name });

  const updateCategory = await category.save();

  return res
    .status(200)
    .json(new ApiRes(200, updateCategory, "Category updated!"));
});

const deleteCategory = asynchandler(async (req, res) => {
  await req.category?.deleteOne();

  return res.status(200).json(new ApiRes(200, {}, "Category deleted!"));
});

const getCategory = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRes(200, req.category, "Category fetched!"));
});

const getCategories = asynchandler(async (req, res) => {
  const categories = await Category.find({ owner: req.user?._id });

  if (categories?.length === 0) {
    return res
      .status(200)
      .json(new ApiRes(200, categories, "No categories found!"));
  }

  return res
    .status(200)
    .json(new ApiRes(200, categories, "Categories fetched!"));
});

export {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
};
