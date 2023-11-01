import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { postDTOSchema } from "~/dtos";
import { createPostInputSchema } from "~/schemas";

import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const POST_PAGE_SIZE = 20;

const throwIfUserIsNotOwnerOfPostWithId = async (
  postId: string,
  userId: string,
  db: PrismaClient,
) => {
  const fullPost = await db.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (fullPost.posterUserId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not the owner of this post.",
    });
  }
};

export const postRouter = createTRPCRouter({
  create: authenticatedProcedure
    .input(createPostInputSchema)
    .output(postDTOSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          ...input,
          posterUserId: ctx.session.user.id,
        },
      });
    }),

  edit: authenticatedProcedure
    .input(z.object({ postId: z.string(), data: createPostInputSchema }))
    .output(postDTOSchema)
    .mutation(async ({ ctx, input }) => {
      await throwIfUserIsNotOwnerOfPostWithId(
        input.postId,
        ctx.session.user.id,
        ctx.db,
      );

      return ctx.db.post.update({
        where: {
          id: input.postId,
        },
        data: input.data,
      });
    }),

  getLatest: publicProcedure
    .output(postDTOSchema.nullable())
    .query(({ ctx }) => {
      return ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" },
      });
    }),

  getNewestPaginated: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1),
      }),
    )
    .output(
      z.object({
        posts: z.array(postDTOSchema),
        hasMore: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        skip: (input.page - 1) * POST_PAGE_SIZE,
        take: POST_PAGE_SIZE,
        orderBy: { createdAt: "desc" },
      });

      return {
        posts,
        hasMore: posts.length === POST_PAGE_SIZE,
      };
    }),

  getTotalPages: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.post.count();
    return Math.ceil(count / POST_PAGE_SIZE);
  }),

  userIsOwnerOfPostWithId: authenticatedProcedure
    .input(z.string())
    .query(async ({ input: postId, ctx }) => {
      try {
        await throwIfUserIsNotOwnerOfPostWithId(
          postId,
          ctx.session.user.id,
          ctx.db,
        );
        return true;
      } catch (e) {
        return false;
      }
    }),

  getById: publicProcedure.input(z.string()).query(({ input: postId, ctx }) => {
    return ctx.db.post.findUniqueOrThrow({
      where: { id: postId },
    });
  }),

  deleteById: authenticatedProcedure
    .input(z.string())
    .output(postDTOSchema)
    .mutation(async ({ input, ctx }) => {
      await throwIfUserIsNotOwnerOfPostWithId(
        input,
        ctx.session.user.id,
        ctx.db,
      );

      return ctx.db.post.delete({
        where: { id: input },
      });
    }),
});
