import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
import { emailRegexp } from "../constants/regexp.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 20,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 64,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    dailyWaterNorma: {
      type: Number,
      default: 1500,
      max: 15000,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["man", "woman"],
      default: "man",
    },
    avatarURL: {
      type: String,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    language: {
      type: String,
      enum: ["en", "ua","es"],
      default: "en",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSetting);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);
export default User;
