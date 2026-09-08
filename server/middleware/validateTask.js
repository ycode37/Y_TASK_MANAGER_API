import { taskNameZod } from "../validation/task.validation.js";

export const validateTask = (req, res, next) => {
  const result = taskNameZod.safeParse(req.body);
  if (!result.success) {
    return next(result.error);
  }
  next();
};
