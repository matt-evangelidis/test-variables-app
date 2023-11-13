import * as z from "zod"

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  email_verified: z.boolean(),
  username: z.string().min(3).max(24),
  pictureKey: z.string().nullish(),
})
