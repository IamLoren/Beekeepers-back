import { Portion } from "../models/Portions.js";

export const listPortions = () => Portion.find();

export const getPortionById = async (contactId) => Portion.findById(contactId);

export const removePortion = async (contactId) =>
  Portion.findByIdAndDelete(contactId);

export const addPortion = async (data) => Portion.create(data);

export const updatePortion = async (id, body) =>
  Portion.findByIdAndUpdate(id, body);
