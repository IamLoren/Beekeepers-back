import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  signinSchema,
  singupSchema,
  subscriptionSchema,
} from "../schemas/usersSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(singupSchema),
  authControllers.register
);
authRouter.post("/login", validateBody(signinSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  authControllers.updateSubscription
);

export default authRouter;