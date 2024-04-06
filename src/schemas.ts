import { postSchema } from "$prisma-schemas/post";
import { userSchema } from "$prisma-schemas/user";
import { variableSchema } from "$prisma-schemas/variable";
import { z } from "zod";

export const userSignUpFormSchema = userSchema.pick({
  email: true,
  username: true,
});

export const userSignInFormSchema = userSchema.pick({
  email: true,
});

export const userUpdateFormSchema = userSchema.pick({
  username: true,
  pictureKey: true,
});

export const createPostInputSchema = postSchema.pick({
  title: true,
  content: true,
});

export const createVariableInputSchema = variableSchema.pick({
  name: true,
  expression: true,
  static: true,
  dependencies: true,
});

export const editVariableInputSchema = variableSchema.pick({
  id: true,
  name: true,
  expression: true,
  static: true,
  dependencies: true,
});

export const displayVariableSchema = variableSchema.extend({
  display: z.string(),
});

export const displayVariableArraySchema = displayVariableSchema.array();
