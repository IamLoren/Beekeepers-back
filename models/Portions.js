import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";

const portionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

portionSchema.post("save", handleSaveError);
portionSchema.pre("findOneAndUpdate", setUpdateSetting);
portionSchema.post("findOneAndUpdate", handleSaveError);

export const Portion = model("portion", portionSchema);
