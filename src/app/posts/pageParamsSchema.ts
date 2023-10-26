import { z } from "zod";

export const individualPostPageParamsSchema = z.object({
  postId: z.string(),
});
