import type { RequestHandler } from "next/dist/server/next";
import { Resend } from "resend";
const resend = new Resend("re_VaKZ1ACS_G8GRVzq4GLMf4kVMkBWLUDDT");

export const POST: RequestHandler = async () => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "thomassiclark@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });
};
