import express from "express";
import { login, register } from "../controller/user.controller.js";
import { validateUser } from "../middleware/validateUser.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const userRouter = express.Router();

userRouter.post("/register", authLimiter, validateUser, register);
userRouter.post("/login", authLimiter, login);

export default userRouter;
