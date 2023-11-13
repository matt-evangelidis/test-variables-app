import * as z from "zod"

export const imageSchema = z.object({
  key: z.string(),
  url: z.string(),
})
