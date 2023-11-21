import { headers } from "next/headers";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const createServerApi = async () => {
  const context = await createTRPCContext({
    resHeaders: headers(),
  });

  return appRouter.createCaller(context);
};
