import { registerZod } from "../validation/user.validation.js";

export const validateUser = (req, res, next) => {
  const result = registerZod.safeParse(req.body);
  if (!result.success) {
    return next(result.error);
  }
  next();
};
