import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";

import { type AppRouter } from "~/server/api/root";
import { getTRPCHandlerUrl, transformer } from "./shared";

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: getTRPCHandlerUrl(),
      headers() {
        const heads = new Map<string, string>();
        heads.set("x-trpc-source", "client");

        return Object.fromEntries(heads);
      },
    }),
  ],
});
