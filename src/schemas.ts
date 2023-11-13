import { postSchema } from "$prisma-schemas/post";
import { userSchema } from "$prisma-schemas/user";

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
