import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Sometimes we may have functions that perform database
 * operations, however if those are used within a transaction,
 * they won't work correctly because they'll be using the
 * base `db` instance instead of the transactional one. This
 * type is the typing of the transactional `db` instance, so
 * we can have our functions optionally take a db instance,
 * so when used in a transaction we just pass the transactional
 * db instance.
 */
export type PassableDBClient = Parameters<
  Parameters<typeof db.$transaction>[0]
>[0];
