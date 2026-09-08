import express, { Router } from "express";
import apiRouter from "./routes/api.routes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();

dotenv.config();
connectDB();
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(helmet());
// Helmet is Express middleware that helps secure an application by setting appropriate HTTP security headers.
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use("/api", apiRouter);
app.use("/user", userRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
