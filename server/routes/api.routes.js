import express from "express";
import {
  CreateTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controller/home.controller.js";
import { authMiddleware } from "../middleware/jwt.js";
import { validateTask } from "../middleware/validateTask.js";
import { validateLimits } from "../middleware/taskfetchingMiddleware.js";

const apiRouter = express.Router();

apiRouter.post("/create", validateTask, authMiddleware, CreateTask);
apiRouter.get("/tasks", validateLimits, authMiddleware, getTasks);
apiRouter.put("/update/:id", authMiddleware, updateTask);
apiRouter.delete("/delete/:id", authMiddleware, deleteTask);

export default apiRouter;
