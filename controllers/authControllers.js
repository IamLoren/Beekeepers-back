import * as authServices from "../services/authServices.js";
import { findUser } from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import * as userServices from "../services/userServices.js";
import sendEmail from "../helpers/sendEmail.js";

import cloudinary from "../helpers/cloudinary.js";
const avatarDir = path.resolve("public", "auth");

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const verificationToken = nanoid();
  const newUser = await authServices.signUp({ ...req.body, verificationToken });
  const token = await sign(newUser);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    token,
    email: newUser.email,
    date: newUser.createdAt,
    gender: newUser.gender,
    dailyNormaWater: newUser.dailyWaterNorma,
    theme: newUser.theme,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  console.log({ verificationToken });
  const user = await userServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await userServices.updateUserStatus(
    { _id: user._id },
    { verify: true, verificationToken: "" }
  );

  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
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
  const { email, createdAt, gender } = req.user;
  res.json = { email, createdAt, gender };
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
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
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

  // const avatarURL = path.join(avatarDir, filename);
  const newUser = await userServices.updateAvatar(_id, avatarURL);

  res.status(201).json(res);
};

export default {
  register: ctrWrapper(register),
  verify: ctrWrapper(verify),
  resendVerify: ctrWrapper(resendVerify),
  login: ctrWrapper(login),
  logout: ctrWrapper(logout),
  getCurrent: ctrWrapper(getCurrent),
  updateWaterRate: ctrWrapper(updateWaterRate),
  updateAvatar: ctrWrapper(updateAvatar),
};
