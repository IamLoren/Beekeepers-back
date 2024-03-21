import express from "express";
import validateBody from "../helpers/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

import {
  getAllPortions,
  getOnePortion,
  deletePortion,
  createPortion,
  updatePortion,
  getWaterConsumptionInfo,
  getDailyConsumptionInfo,
} from "../controllers/portionsControllers.js";
import {
  createPortionSchema,
  updatePortionSchema,
} from "../schemas/portionsSchemas.js";

const portionsRouter = express.Router();

portionsRouter.use(authenticate);

portionsRouter.get("/", getAllPortions);

portionsRouter.delete("/:id", isValidId, deletePortion);

portionsRouter.post("/", validateBody(createPortionSchema), createPortion);

portionsRouter.put(
  "/:id",
  isValidId,
  validateBody(updatePortionSchema),
  updatePortion
);

portionsRouter.get("/month/:date", getWaterConsumptionInfo);

portionsRouter.get("/today/:date", getDailyConsumptionInfo);

portionsRouter.get("/:id", isValidId, getOnePortion);
export default portionsRouter;
