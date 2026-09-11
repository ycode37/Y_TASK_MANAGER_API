import { taskFetchingValidation } from "../validation/task.fetching.validation.js";

export const validateLimits = (req, res, next) => {
  const result = taskFetchingValidation.safeParse(req.query);
  if (!result.success) {
    return next(result.error);
  }
  next();
};
