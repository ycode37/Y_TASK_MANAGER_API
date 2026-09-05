import express, { Router } from "express";
import apiRouter from "./routes/api.routes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
const app = express();
dotenv.config();
connectDB();
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(express.json());
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
