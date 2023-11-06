import * as z from "zod"

export const sessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint(),
})
