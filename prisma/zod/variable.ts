import * as z from "zod"

export const variableSchema = z.object({
  id: z.string(),
  name: z.string(),
  formula: z.string().nullish(),
  value: z.number(),
  static: z.boolean(),
  dependencies: z.string().array(),
})
