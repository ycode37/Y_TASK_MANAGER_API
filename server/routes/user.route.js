import express from "express";
import { getMe, login, register } from "../controller/user.controller.js";
import { validateUser } from "../middleware/validateUser.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { authMiddleware } from "../middleware/jwt.js";

const userRouter = express.Router();

userRouter.post("/register", authLimiter, validateUser, register);
userRouter.post("/login", authLimiter, login);
userRouter.get("/me", /*authMiddleware,*/ getMe);

export default userRouter;
