import Joi from "joi";
import { emailRegexp } from "../constants/regexp.js";

export const singupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).required(),
});

export const waterRateSchema = Joi.object({
  dailyWaterNorma: Joi.number().min(0).max(15000).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().pattern(emailRegexp),
  oldPassword: Joi.string().min(8),
  newPassword: Joi.string().min(8),
  gender: Joi.string().valid("man", "woman"),
});
