import * as portionsService from "../services/portionsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";

export const getAllPortions = async (req, res) => {
  const result = await portionsService.listPortions();
  res.json(result);
};

export const getOnePortion = async (req, res) => {
  const { id } = req.params;
  const result = await portionsService.getPortionById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const deletePortion = (req, res) => {
  const { id } = req.params;
  const result = portionsService.removePortion(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(204).send();
};

export const createPortion = async (req, res) => {
  if (req.body.amount > 5000) {
    throw HttpError(400, "Amount of water cannot exceed 5000ml");
  }
  const result = await portionsService.addPortion(req.body);
  res.status(201).json(result);
};

export const updatePortion = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, (message = "Body must have at least one field"));
  }
  const { id } = req.params;
  const result = await portionsService.updatePortion(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
  getAllPortions: ctrWrapper(getAllPortions),
  getOnePortion: ctrWrapper(getOnePortion),
  createPortion: ctrWrapper(createPortion),
  updatePortion: ctrWrapper(updatePortion),
  deletePortion: ctrWrapper(deletePortion),
};
