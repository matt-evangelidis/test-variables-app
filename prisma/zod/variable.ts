import * as z from "zod"

export const variableSchema = z.object({
  id: z.string(),
  name: z.string(),
  expression: z.string(),
  static: z.boolean(),
  dependencies: z.string().array(),
})
