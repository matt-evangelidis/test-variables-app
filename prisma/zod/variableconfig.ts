import * as z from "zod"

export const variableConfigSchema = z.object({
  id: z.string(),
  variable_id: z.string(),
  current: z.number().int().nullish(),
})
