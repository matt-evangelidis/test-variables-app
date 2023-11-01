import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession as baseGetServerSession,
  type AuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider, {
  type SendVerificationRequestParams,
} from "next-auth/providers/email";
import AuthLinkEmailTemplate from "$email-templates/auth-link";
import { resend } from "$resend";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { env } from "~/env.mjs";
import { generateRandomUserName } from "$generateRandomUsername";
import { renderAsync } from "@react-email/render";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  await resend.emails.send({
    from: `Test Posts <${params.provider.from}>`,
    to: params.identifier,
    subject: "Sign In To Test Posts",
    // react: AuthLinkEmailTemplate({
    //   confirmationUrl: params.url,
    // }),
    html: await renderAsync(
      AuthLinkEmailTemplate({
        confirmationUrl: params.url,
      }),
    ),
  });
};

export const authOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    createUser: async ({ user }) => {
      // Assign a user a default random username
      // when they sign up
      await db.user.update({
        where: {
          id: user.id,
          name: null,
        },
        data: {
          name: generateRandomUserName(),
        },
      });
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: "",
      from: "authentication@auth.test-posts.com",
      sendVerificationRequest,
    }),
  ],
  debug: env.NODE_ENV === "development",
} satisfies AuthOptions;

export const getServerAuthSession = () => baseGetServerSession(authOptions);

export const redirectToSignIn = () => redirect("/api/auth/signin");
