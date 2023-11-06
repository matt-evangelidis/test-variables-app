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
      if (ctx.session.user.userId !== input.userId) {
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
      if (ctx.session.user.userId !== userToFetchId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own profile",
        });
      }

      return ctx.db.user.findUniqueOrThrow({ where: { id: userToFetchId } });
    }),

  getUsernameWithId: publicProcedure
    .input(z.string())
    .output(z.string())
    .query(async ({ input: userId, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return user.username;
    }),

  deleteById: authenticatedProcedure
    .input(z.string())
    .output(inwardFacingUserDTOSchema)
    .mutation(async ({ ctx, input: userId }) => {
      if (userId !== ctx.session.user.userId) {
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

  getIdOfUserWithEmailIfItExists: publicProcedure
    .input(z.string().email())
    .output(z.string().nullable())
    .mutation(async ({ input: emailToCheck, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: emailToCheck,
        },
        select: {
          id: true,
        },
      });

      return user?.id ?? null;
    }),
});
