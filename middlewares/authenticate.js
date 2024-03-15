import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { findUserById } from "../services/userServices.js";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(HttpError(401, "Not authorized"));
  }
  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(id);
    if (!user || !user.token) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};