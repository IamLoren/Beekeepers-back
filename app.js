import express from "express";
import morgan from "morgan";

import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import portionsRouter from "./routes/portionsRouter.js";
import { authenticate } from "./middlewares/authenticate.js";
import validateBody from "./helpers/validateBody.js";
import { waterRateSchema } from "./schemas/usersSchemas.js";
import authControllers from "./controllers/authControllers.js";
dotenv.config();

const app = express();


app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/portions", portionsRouter);
// app.use(
//   "/api/auth/water-rate",
//   authenticate,
//   validateBody(waterRateSchema),
//   authControllers.updateWaterRate
// );

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { DB_HOST, PORT = 4000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
