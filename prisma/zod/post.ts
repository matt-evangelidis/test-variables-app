import * as z from "zod"

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(64),
  content: z.string().min(1).max(1024),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorUserId: z.string(),
})
