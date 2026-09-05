import express from "express";
import {
  CreateTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controller/home.controller.js";

const apiRouter = express.Router();

apiRouter.post("/create", CreateTask);
apiRouter.get("/tasks", getTasks);
apiRouter.put("/update/:id", updateTask);
apiRouter.delete("/delete/:id", deleteTask);

export default apiRouter;
