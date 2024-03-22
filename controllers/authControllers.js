import * as authServices from "../services/authServices.js";
import { findUser } from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

import * as userServices from "../services/userServices.js";

import cloudinary from "../helpers/cloudinary.js";
const avatarDir = path.resolve("public", "auth");

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.signUp(req.body);
  const token = await sign(newUser);

  res.status(201).json({
    token,
    email: newUser.email,
    date: newUser.createdAt,
    gender: newUser.gender,
    dailyNormaWater: newUser.dailyWaterNorma,
    theme: newUser.theme,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Invalid email or password");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Invalid email or password");
  }
  const token = await sign(user);
  res.json({
    token,
    user: {
      email,
      createdAt: user.createdAt,
      gender: user.gender,
      dailyNormaWater: user.dailyWaterNorma,
      theme: user.theme,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  const user = await findUser({ email });
  res.status(200).json(token, {
    email: user.email,
    createdAt: user.createdAt,
    gender: user.gender,
    avatarURL: user.avatarURL,
    dailyNorma: user.dailyNorma,
    theme: user.theme,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);
  res.status(204).end();
};

const sign = async (user) => {
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "23h" });
  await authServices.setToken(user._id, token);
  return token;
};

export const updateWaterRate = async (req, res) => {
  const { _id } = req.user;
  const result = await userServices.updateUserWaterRate(_id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    result,
  });
};

const updateAvatar = async (req, res) => {
  const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
  });
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarDir, filename);

  await fs.rename(oldPath, newPath);

  const image = await Jimp.read(newPath);
  await image.resize(250, 250).writeAsync(newPath);

  const avatarURL = path.join(avatarDir, filename);
  const newUser = await userServices.updateAvatar(_id, avatarURL);

  res.json({ avatarURL: newUser.avatarURL });
};

export default {
  register: ctrWrapper(register),
  login: ctrWrapper(login),
  logout: ctrWrapper(logout),
  getCurrent: ctrWrapper(getCurrent),
  updateWaterRate: ctrWrapper(updateWaterRate),
  updateAvatar: ctrWrapper(updateAvatar),
};
