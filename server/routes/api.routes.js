import express from "express";
import {
  CreateTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controller/home.controller.js";
import { authMiddleware } from "../middleware/jwt.js";

const apiRouter = express.Router();

apiRouter.post("/create", authMiddleware, CreateTask);
apiRouter.get("/tasks", authMiddleware, getTasks);
apiRouter.put("/update/:id", authMiddleware, updateTask);
apiRouter.delete("/delete/:id", authMiddleware, deleteTask);

export default apiRouter;
