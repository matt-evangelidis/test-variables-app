import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { inwardFacingUserDTOSchema, outwardFacingUserDTOSchema } from "~/dtos";
import { userUpdateFormSchema } from "~/schemas";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: authenticatedProcedure
    .input(
      z.object({
        userId: z.string(),
        data: userUpdateFormSchema,
      }),
    )
    .output(inwardFacingUserDTOSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own profile",
        });
      }

      const result = await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: input.data,
      });

      return result;
    }),

  getOutwardFacingById: publicProcedure
    .input(z.string())
    .output(outwardFacingUserDTOSchema)
    .query(async ({ input: userToFetchId, ctx }) =>
      ctx.db.user.findUniqueOrThrow({ where: { id: userToFetchId } }),
    ),

  getInwardFacingById: authenticatedProcedure
    .input(z.string())
    .output(inwardFacingUserDTOSchema)
    .query(({ input: userToFetchId, ctx }) => {
      if (ctx.session.user.id !== userToFetchId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own profile",
        });
      }

      return ctx.db.user.findUniqueOrThrow({ where: { id: userToFetchId } });
    }),

  getUsernameWithId: publicProcedure
    .input(z.string())
    .output(z.string().nullable())
    .query(async ({ input: userId, ctx }) => {
      const { name } = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      });

      return name;
    }),

  deleteById: authenticatedProcedure
    .input(z.string())
    .output(inwardFacingUserDTOSchema)
    .mutation(async ({ ctx, input: userId }) => {
      if (userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own profile",
        });
      }

      return await ctx.db.user.delete({
        where: {
          id: userId,
        },
      });
    }),
});
