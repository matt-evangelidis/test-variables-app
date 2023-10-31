import { userSchema } from "$prisma-schemas/user";
import { z } from "zod";

export const userUpdateFormSchema = userSchema
  .pick({
    image: true,
    name: true,
  })
  .setKey("name", z.string());

export const createPostInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
