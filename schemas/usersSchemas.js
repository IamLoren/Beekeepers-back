import Joi from "joi";
import { emailRegexp } from "../constants/regexp.js";

export const singupSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).required(),
});
