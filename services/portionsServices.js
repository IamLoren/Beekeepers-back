import { Portion } from "../models/Portions.js";

export const listPortions = () => Portion.find();

export const getPortionById = async (id) => Portion.findById(id);

export const removePortion = async (id) => Portion.findByIdAndDelete(id);

export const addPortion = async (data) => Portion.create(data);

export const updatePortion = async (id, body) =>
  Portion.findByIdAndUpdate(id, body);

export const findPortionsByMonthAndUser = async (userId, month) => {
  const portions = await Portion.find({
    userId: userId,
    $expr: {
      $and: [{ $eq: [{ $month: "$createdAt" }, month] }],
    },
  });
  return portions;
};

export const findPortionsByDayAndUser = async (userId, day) => {
  const portions = await Portion.find({
    userId: userId,
    $expr: {
      $and: [{ $eq: [{ $dayOfMonth: "$createdAt" }, day] }],
    },
  });
  return portions;
};
