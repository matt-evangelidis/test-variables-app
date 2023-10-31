import { TRPCError } from "@trpc/server";
import { z } from "zod";
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

  getPreferredDisplayNameWithId: publicProcedure
    .input(z.string())
    .output(z.string())
    .query(async ({ input, ctx }) => {
      const { email, name } = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: input,
        },
        select: {
          email: true,
          name: true,
        },
      });

      return name ?? email;
    }),

  deleteById: authenticatedProcedure
    .input(z.string())
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
