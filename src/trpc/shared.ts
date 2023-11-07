import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { env } from "~/env.mjs";

import { type AppRouter } from "~/server/api/root";

export const transformer = superjson;

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return env.URL;
};

export const getTRPCHandlerUrl = () => {
  return getBaseUrl() + "/api/trpc";
};

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
