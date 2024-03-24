import express from "express";
import authControllers, {
  updateWaterRate,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  signinSchema,
  singupSchema,
  updateUserSchema,
  verifySchema,
  waterRateSchema,
} from "../schemas/usersSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(singupSchema),
  authControllers.register
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(verifySchema),
  authControllers.resendVerify
);

authRouter.post("/login", validateBody(signinSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/water-rate",
  authenticate,
  validateBody(waterRateSchema),
  authControllers.updateWaterRate
);

authRouter.patch(
  "/user",
  authenticate,
  validateBody(updateUserSchema),
  authControllers.updateUser
);

authRouter.patch(
  "/avatar",
  upload.single("avatarURL"),
  authenticate,
  authControllers.updateAvatar
);

export default authRouter;
