import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getURLByKey: publicProcedure
    .input(z.string())
    .output(z.string().or(z.undefined()))
    .query(({ input, ctx }) =>
      ctx.db.uploadedImage
        .findUnique({
          where: {
            key: input,
          },
          select: {
            url: true,
          },
        })
        .then((data) => data?.url),
    ),
});
