import { z } from "zod";

export const registerZod = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(6),
});
