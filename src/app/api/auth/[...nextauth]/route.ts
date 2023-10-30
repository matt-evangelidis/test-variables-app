import NextAuth from "next-auth";
import EmailProvider, {
  type SendVerificationRequestParams,
} from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/server/db";
import { resend } from "$resend";
import AuthConfirmEmailTemplate from "@email-templates/auth-confirm";

const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  await resend.emails.send({
    from: `Test Posts <${params.provider.from}>`,
    to: params.identifier,
    subject: "Confirm",
    react: AuthConfirmEmailTemplate({
      confirmationUrl: params.url,
    }),
  });
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: "",
      from: "authentication@auth.test-posts.com",
      sendVerificationRequest,
    }),
  ],
});

export { handler as GET, handler as POST };
