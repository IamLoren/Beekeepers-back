import { Portion } from "../models/Portions.js";

export const listPortions = () => Portion.find();

export const getPortionById = async (id) => Portion.findById(id);

export const removePortion = async (id) => Portion.findByIdAndDelete(id);

export const addPortion = async (data) => Portion.create(data);

export const updatePortion = async (id, body) =>
  Portion.findByIdAndUpdate(id, body);

export const findPortionsByMonth = async (month) => {
  const portions = await Portion.find({
    $expr: {
      $and: [{ $eq: [{ $month: "$createdAt" }, month] }],
    },
  });
  return portions;
};
