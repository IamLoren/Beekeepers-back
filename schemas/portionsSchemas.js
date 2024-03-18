import Joi from "joi";

export const createPortionSchema = Joi.object({
  amount: Joi.number().required(),
  time: Joi.string().required(),
  dailyNorma: Joi.number().required(),
  consumeRatio: Joi.number().required(),
});

export const updatePortionSchema = Joi.object({
  amount: Joi.number(),
  time: Joi.string(),
  dailyNorma: Joi.number().required(),
  consumeRatio: Joi.number().required(),
});
