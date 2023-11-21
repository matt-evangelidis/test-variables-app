import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { inwardFacingUserDTOSchema, outwardFacingUserDTOSchema } from "~/dtos";
import { userUpdateFormSchema } from "~/schemas";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { adminService } from "~/services/admin";

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
        data: {
          ...input.data,
          pictureKey: input.data.pictureKey,
        },
      });

      adminService.deleteDanglingUserPictures().catch((e) => {
        console.error("Failed to delete dangling user pictures", e);
      });

      return result;
    }),

  getOutwardFacingById: publicProcedure
    .input(z.string())
    .output(outwardFacingUserDTOSchema)
    .query(async ({ input: userToFetchId, ctx }) =>
      ctx.db.user.findUniqueOrThrow({
        where: { id: userToFetchId },
        include: {
          picture: true,
        },
      }),
    ),

  getInwardFacingById: authenticatedProcedure
    .input(z.string())
    .output(inwardFacingUserDTOSchema)
    .query(async ({ input: userToFetchId, ctx }) => {
      if (ctx.session.user.userId !== userToFetchId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only view your own profile",
        });
      }

      const profile = await ctx.db.user.findUnique({
        where: { id: userToFetchId },
        include: { picture: true },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return profile;
    }),

  getUserAuthorDisplayInfo: publicProcedure
    .input(z.string())
    .output(
      z.object({
        username: z.string(),
        pictureUrl: z.string().url().optional(),
      }),
    )
    .query(async ({ input: userId, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
          picture: {
            select: {
              url: true,
            },
          },
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      return {
        username: user.username,
        pictureUrl: user.picture?.url,
      };
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
});
