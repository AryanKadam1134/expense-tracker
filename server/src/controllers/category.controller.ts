import { Category } from "../models/category.model";

import ApiRes from "../utils/ApiRes";
import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";
import { paginateQuery } from "../utils/pagination";

const addCategory = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required!");
  }

  const categoryExists = await Category.findOne({
    name,
    ownerId: loggedUserId,
  });

  if (categoryExists) {
    throw new ApiError(400, "Category already exists!");
  }

  const createCategory = await Category.create({
    name,
    ownerId: loggedUserId,
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
    ownerId: loggedUserId,
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
  const { page, limit } = req.query;
  const parsedPage = typeof page === "string" ? Number(page) : undefined;
  const parsedLimit = typeof limit === "string" ? Number(limit) : undefined;

  const categories = await paginateQuery({
    model: Category,
    filter: { ownerId: req.user?._id },
    page: parsedPage,
    limit: parsedLimit,
  });

  if (categories.data.length === 0) {
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
