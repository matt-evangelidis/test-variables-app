import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Resend } from "resend";
import { env } from "~/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export const testRouter = createTRPCRouter({
  email: publicProcedure.mutation(async () => {
    const result = await resend.emails.send({
      from: "test@auth.test-posts.com",
      to: "thomassiclark@gmail.com",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    return result;
  }),
});
