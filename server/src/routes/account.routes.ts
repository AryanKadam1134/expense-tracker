import { Router } from "express";

import { addAccount } from "../controllers/account.controller";
import { verifyUser } from "../middlewares/auth.middleware";

const accountRouter = Router();

accountRouter.use(verifyUser);

accountRouter.route("/").post(addAccount);

export default accountRouter;
