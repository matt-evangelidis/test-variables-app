import { lucia } from "lucia";
import { env } from "~/env.mjs";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "~/server/db";
import { nextjs_future } from "lucia/middleware";
import * as allOfNextHeaders from "next/headers";
import { redirect } from "next/navigation";

export const auth = lucia({
  env: env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  adapter: prismaAdapter(db),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (data) => ({
    // Determine what data from the user object gets
    // stored in the session object
    email: data.email,
    email_verified: data.email_verified,
  }),
  getSessionAttributes: () => ({}),
});

export type Auth = typeof auth;

export const getServerAuthSession = () =>
  auth.handleRequest("GET", allOfNextHeaders).validate();

export const redirectToSignIn = () => redirect("/auth/sign-up");
