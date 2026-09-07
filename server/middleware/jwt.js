import express from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const newToken = token.split(" ")[1];
  const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
  req.userId = decoded.id;
  next();
};
