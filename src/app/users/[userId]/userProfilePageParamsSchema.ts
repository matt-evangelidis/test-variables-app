import { z } from "zod";

export const userProfilePageParamsSchema = z.object({
  userId: z.string(),
});

export const userProfilePageSearchParamsSchema = z.object({
  userIsNew: z.coerce.boolean().default(false),
});
