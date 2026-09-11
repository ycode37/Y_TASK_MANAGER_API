import { z } from "zod";

export const taskFetchingValidation = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Using z.coerce.number() converts incoming query strings like "1" into numeric 1, allowing validation to pass smoothly.
