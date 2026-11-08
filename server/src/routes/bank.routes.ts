import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware.ts";
import { getBankById } from "../middlewares/bank.middleware.ts";

import {
  addBank,
  deleteBank,
  getBank,
  getBanks,
  updateBank,
} from "../controllers/bank.controller.ts";

const bankRouter = Router();

bankRouter.use(verifyUser);

bankRouter.route("/").post(addBank).get(getBanks);

bankRouter
  .route("/:bankId")
  .put(getBankById, updateBank)
  .delete(getBankById, deleteBank)
  .get(getBankById, getBank);

export default bankRouter;
