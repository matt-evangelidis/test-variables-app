import EmailTemplateConfirmEmail from "$email-templates/auth-confirm-email";
import EmailTemplateSignIn from "$email-templates/auth-sign-in";
import { renderAsync } from "@react-email/render";
import { resend } from "~/server/resend";

const FROM = "Test Posts <authentication@auth.test-posts.com>";
type SendVerificationEmailInput = {
  to: string;
  verificationLink: string;
  username: string;
};

export const sendConfirmationEmail = async ({
  to,
  verificationLink,
  username,
}: SendVerificationEmailInput) =>
  resend.emails.send({
    from: FROM,
    to,
    subject: "Confirm your email address",
    html: await renderAsync(
      EmailTemplateConfirmEmail({
        username,
        confirmationUrl: verificationLink,
      }),
    ),
  });

type SendSignInEmailInput = {
  to: string;
  signInLink: string;
  username: string;
};

export const sendSignInEmail = async ({
  to,
  signInLink,
  username,
}: SendSignInEmailInput) =>
  resend.emails.send({
    from: FROM,
    to,
    subject: "Sign in to your account",
    html: await renderAsync(
      EmailTemplateSignIn({
        username,
        signInUrl: signInLink,
      }),
    ),
  });
