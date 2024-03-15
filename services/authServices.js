import User from "../models/User.js";
import bcrypt from "bcrypt";

export const signUp = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 6);
  return User.create({ ...data, password: hashPassword });
};

export const setToken = (id, token = "") => {
  return User.findByIdAndUpdate(id, { token });
};

export const setSubscription = (id, subscription) => {
  return User.findByIdAndUpdate(id, { subscription });
};