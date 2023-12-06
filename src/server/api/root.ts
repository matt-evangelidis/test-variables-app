import { authRouter } from "~/server/api/routers/auth";
import { imageRouter } from "~/server/api/routers/image";
import { postRouter } from "~/server/api/routers/post";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { variableRouter } from "~/server/api/routers/variable";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  auth: authRouter,
  image: imageRouter,
  variable: variableRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
