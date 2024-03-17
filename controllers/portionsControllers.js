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

export const getWaterConsumptionInfo = async (req, res) => {
  const [day, month, year] = req.params.date.split(".");
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const portions = await portionsService.findPortionsByMonth(month);
  // const dailyNorma = await portionsService.findDailyNorma(user); // rename when ready
  const dailyNorma = 2000;

  const groupedPortions = portions.reduce((acc, portion) => {
    const portionDate = new Date(portion.createdAt);
    const day = portionDate.getDate();
    acc[day] = acc[day] || [];
    acc[day].push(portion);
    return acc;
  }, {});
  console.log(groupedPortions);

  const dailyConsumptionRatios = [];
  for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
    const dayPortions = groupedPortions[day] || [];
    const consumedWater = dayPortions.reduce(
      (total, portion) => total + portion.amount,
      0
    );
    const consumedWaterRatio = Math.round((consumedWater / dailyNorma) * 100);
    dailyConsumptionRatios.push({ day: day.toString(), consumedWaterRatio });
  }

  res.json(dailyConsumptionRatios);
};

export default {
  getAllPortions: ctrWrapper(getAllPortions),
  getOnePortion: ctrWrapper(getOnePortion),
  createPortion: ctrWrapper(createPortion),
  updatePortion: ctrWrapper(updatePortion),
  deletePortion: ctrWrapper(deletePortion),
  getWaterConsumptionInfo: ctrWrapper(getWaterConsumptionInfo),
};
