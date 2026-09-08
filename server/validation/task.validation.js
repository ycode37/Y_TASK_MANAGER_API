import { z } from "zod";

export const taskNameZod = z.object({
  taskName: z.string().trim().min(1),
});
