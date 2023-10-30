import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession as baseGetServerSession, type AuthOptions } from "next-auth";
import EmailProvider, {
  type SendVerificationRequestParams,
} from "next-auth/providers/email";
import AuthConfirmEmailTemplate from "@email-templates/auth-confirm";
import { resend } from "$resend";
import { db } from "~/server/db";

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

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: "",
      from: "authentication@auth.test-posts.com",
      sendVerificationRequest,
    }),
  ],
}

export const getServerSession = () => baseGetServerSession(authOptions);