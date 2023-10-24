import { z } from "zod";
import { createPostInputSchema } from "~/schemas";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const POST_PAGE_SIZE = 20;

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPostInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: "",
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
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
});
