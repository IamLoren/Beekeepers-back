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
} from "../controllers/portionsControllers.js";
import {
  createPortionSchema,
  updatePortionSchema,
} from "../schemas/portionsSchemas.js";

const portionsRouter = express.Router();

// portionsRouter.use(authenticate);

portionsRouter.get("/", getAllPortions);

portionsRouter.get("/:id", isValidId, getOnePortion);

portionsRouter.delete("/:id", isValidId, deletePortion);

portionsRouter.post("/", validateBody(createPortionSchema), createPortion);

portionsRouter.put(
  "/:id",
  isValidId,
  validateBody(updatePortionSchema),
  updatePortion
);

export default portionsRouter;
