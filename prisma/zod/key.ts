import * as z from "zod"

export const keySchema = z.object({
  id: z.string(),
  hashed_password: z.string().nullish(),
  user_id: z.string(),
})
