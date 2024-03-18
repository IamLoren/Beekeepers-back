import express from "express";
import authControllers, {
  updateWaterRate,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  signinSchema,
  singupSchema,
  waterRateSchema,
} from "../schemas/usersSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import { updateUserWaterRate } from "../services/userServices.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(singupSchema),
  authControllers.register
);
authRouter.post("/login", validateBody(signinSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

// authRouter.patch(
//   "/water-rate",
//   authenticate,
//   validateBody(singupSchema),
//   authControllers.updateWaterRate
// );

export default authRouter;
