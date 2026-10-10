import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { getCategoryById } from "../middlewares/category.middleware";

const categoryRouter = Router();

categoryRouter.use(verifyUser);

categoryRouter.route("/").post(addCategory).get(getCategories);

categoryRouter
  .route("/:categoryId")
  .put(getCategoryById, updateCategory)
  .delete(getCategoryById, deleteCategory)
  .get(getCategoryById, getCategory);

export default categoryRouter;
