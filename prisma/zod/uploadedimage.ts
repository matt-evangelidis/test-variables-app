import * as z from "zod"

export const uploadedImageSchema = z.object({
  key: z.string(),
  url: z.string().url(),
  size: z.number().int(),
  isUserPicture: z.boolean(),
})
