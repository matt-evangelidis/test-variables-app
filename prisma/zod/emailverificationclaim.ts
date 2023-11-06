import * as z from "zod"

export const emailVerificationClaimSchema = z.object({
  token: z.string(),
  expires: z.date(),
  user_id: z.string(),
})
