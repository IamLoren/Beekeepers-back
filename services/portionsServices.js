import { Portion } from "../models/Portions.js";

export const listPortions = () => Portion.find();

export const getPortionById = async (id) => Portion.findById(id);

export const removePortion = async (id) => Portion.findByIdAndDelete(id);

export const addPortion = async (data) => Portion.create(data);

export const updatePortion = async (id, body) =>
  Portion.findByIdAndUpdate(id, body);

export const findPortionsByMonthAndUser = async (userId, month) => {
  const startOfMonth = new Date(Date.UTC(new Date().getFullYear(), month - 1, 1));
  const endOfMonth = new Date(Date.UTC(new Date().getFullYear(), month, 0, 23, 59, 59, 999));
console.log(startOfMonth, endOfMonth, 'startOfMonth, endOfMonth')
  // Запит до бази даних для отримання порцій за вказаний місяць та користувача
  const portions = await Portion.find({
    userId: userId,
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });
  
  return portions;

  // const portions = await Portion.find({
  //   userId: userId,
  //   $expr: {
  //     $and: [{ $eq: [{ $month: "$createdAt" }, month] }],
  //   },
  // });
  // return portions;
};

export const findPortionsByDayAndUser = async (userId, startDate, endDate) => {
  const portions = await Portion.find({
    userId: userId,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });
  return portions;
};
