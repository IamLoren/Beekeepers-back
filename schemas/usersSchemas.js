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

export const verifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});
