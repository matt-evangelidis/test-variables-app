import { postSchema } from "$prisma-schemas/post";
import { userSchema } from "$prisma-schemas/user";
import { type z } from "zod";

/**
 * "DTO" stands for "data transfer object". Often when dealing with
 * databases, we have entities wherein we want to omit certain fields
 * from being exposed to the client for security reasons. A "DTO" is
 * a version of an entity that has had all it's sensitive data removed.
 *
 * Some entities may have multiple DTOs, for if different pieces of
 * data are considered "sensitive" in different contexts. For instance,
 * we never want to expose a user's email to other users, however it
 * is fine if we expose their email to themselves. So we have two
 * different user DTOs, an "outward facing" DTO that we use when we
 * want to expose a user's information to other users, and an "inward
 * facing" DTO that we use when we want to expose a user's information
 * to themselves.
 */

/* ---------------------------------- */
/*              User DTOs             */
/* ---------------------------------- */

/**
 * "outward facing" refers to any instance where a user's information
 * is going to be exposed to other users.
 */
export const outwardFacingUserDTOSchema = userSchema.omit({
  email: true,
  emailVerified: true,
});
export type OutwardFacingUserDTO = z.infer<typeof outwardFacingUserDTOSchema>;

export const inwardFacingUserDTOSchema = userSchema.omit({
  emailVerified: true,
});
export type InwardFacingUserDTO = z.infer<typeof inwardFacingUserDTOSchema>;

/* ---------------------------------- */
/*              Post DTOs             */
/* ---------------------------------- */
export const postDTOSchema = postSchema;

export type PostDTO = z.infer<typeof postDTOSchema>;
