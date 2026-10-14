import { Router } from "express";

import { verifyUser } from "../middlewares/auth.middleware";
import { getBankById } from "../middlewares/bank.middleware";

import {
  addBank,
  deleteBank,
  getBank,
  getBanks,
  updateBank,
} from "../controllers/bank.controller";

const bankRouter = Router();

bankRouter.use(verifyUser);

bankRouter.route("/").post(addBank).get(getBanks);

bankRouter
  .route("/:bankId")
  .put(getBankById, updateBank)
  .delete(getBankById, deleteBank)
  .get(getBankById, getBank);

export default bankRouter;
