import { postSchema } from "$prisma-schemas/post";
import { uploadedImageSchema } from "$prisma-schemas/uploadedimage";
import { userSchema } from "$prisma-schemas/user";

export const relatedUserSchema = userSchema.extend({
  posts: postSchema.array().nullish(),
  picture: uploadedImageSchema.nullish(),
});

export const relatedPostSchema = postSchema.extend({
  author: userSchema.nullish(),
});
